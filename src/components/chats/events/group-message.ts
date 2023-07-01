import { z } from 'zod';
import _ from 'lodash';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import schema from '../../../shares/schema';
import Firebase from '../../../shares/Firebase';
import ENVIRONMENT from '../../../config/environment';
import {
  encryptMessageMetadata,
  getGroupEncryption,
  isUserInGroup,
} from '../utils/common';
import db from '../../../models';
import Group from '../../groups/models';

const chatBasePath = ENVIRONMENT.CHAT_BASE_PATH;

export async function createGroupMessageGroup(
  payload: z.infer<(typeof schema.chats)['createGroupMessageSchema']>
) {
  const basePath = `${chatBasePath}/groups/users`;
  const timestamp = Timestamp.now();
  const members = _.uniq(payload.members);
  const { name } = payload;

  const informationData: Partial<HourChat.Firestore.GroupMetadata> = {
    members,
    timestamp,
    name,
  };

  const { firestore } = Firebase.instance;

  const group = await Group.instance.create({
    members,
    name,
  });

  const uuid = group.dataValues.id;

  return Promise.all(
    _.map(_.uniq(members), (member) =>
      Promise.all([
        firestore.doc(`${basePath}/${member}`).set(
          {
            [uuid]: {
              uuid,
              name,
            },
          },
          { merge: true }
        ),
        firestore
          .doc(`${basePath}/${member}/groups/${uuid}`)
          .set(informationData, { merge: true }),
      ])
    )
  );
}

export async function sendGroupMessage(
  payload: z.infer<(typeof schema.chats)['groupMessageSchema']>
) {
  const { senderId, uuid } = payload;

  const basePath = `${chatBasePath}/groups/users`;
  const timestamp = Timestamp.now();

  const informationData: Partial<HourChat.Firestore.Metadata> = {
    timestamp,
  };

  const [group, encryption] = await getGroupEncryption(uuid);

  if (!group || !isUserInGroup(group, senderId)) return;

  const messageData = encryptMessageMetadata(
    {
      ..._.pick(payload, ['body', 'files']),
      senderId,
      timestamp,
    },
    encryption.dataValues
  );

  const { firestore } = Firebase.instance;

  return Promise.all(
    _.map(group?.dataValues?.members ?? [], (member) => {
      const baseMemberPath = `${basePath}/${member}`;
      const groupPath = `${baseMemberPath}/groups/${uuid}`;

      return Promise.all([
        firestore.collection(`${groupPath}/messages`).add(messageData),
        firestore.doc(groupPath).set(informationData, { merge: true }),
        firestore.doc(baseMemberPath).set(
          {
            [uuid]: {
              ...messageData,
              uuid,
              total: FieldValue.increment(1),
            },
          },
          { merge: true }
        ),
      ]);
    })
  );
}

export async function updateGroupMessageTyping(
  payload: z.infer<(typeof schema.chats)['groupMessageTypingSchema']>
) {
  const { uuid, senderId } = payload;
  const typing = payload.typing
    ? FieldValue.arrayUnion(senderId)
    : FieldValue.arrayRemove(senderId);

  const basePath = `${chatBasePath}/groups/users`;

  const informationData: Partial<HourChat.Firestore.Metadata> = {
    typing,
  };

  const group = await Group.instance.findOne({
    where: {
      id: uuid,
    },
  });

  if (!group || !isUserInGroup(group, senderId)) return;

  const { firestore } = Firebase.instance;

  return Promise.all(
    _.map(group?.dataValues?.members ?? [], (member) =>
      firestore
        .doc(`${basePath}/${member}/groups/${uuid}`)
        .set(informationData, { merge: true })
    )
  );
}

export async function removeFromGroup(
  payload: z.infer<(typeof schema.chats)['removeFromGroupSchema']>
) {
  const { senderId, uuid } = payload;
  const members = (
    _.isArray(payload.members) ? payload.members : [payload.members]
  ) as string[];
  const basePath = `${chatBasePath}/groups/users`;

  const informationData: Partial<HourChat.Firestore.Metadata> = {
    members: FieldValue.arrayRemove(...members),
  };

  return db.sequelize.transaction(async (tx) => {
    const queryOption = {
      where: {
        id: uuid,
      },
      transaction: tx,
    };

    const group = await Group.instance.findOne(queryOption);
    const newMembers = (group?.dataValues?.members ?? []).filter(
      (member) => !_.includes(members, member)
    );

    if (!group || !isUserInGroup(group, senderId)) return;

    await Group.instance.update(
      {
        members: newMembers,
      },
      queryOption
    );

    const { firestore } = Firebase.instance;

    return Promise.all([
      ..._.map(group?.dataValues?.members ?? [], (member) =>
        firestore
          .doc(`${basePath}/${member}/groups/${uuid}`)
          .set(informationData, { merge: true })
      ),
      ..._.map(members, (member) =>
        firestore.doc(`${basePath}/${member}/groups/${uuid}`).delete()
      ),
    ]);
  });
}

export async function removeGroup(
  payload: z.infer<(typeof schema.chats)['removeGroupSchema']>
) {
  const { uuid, senderId } = payload;
  const basePath = `${chatBasePath}/groups/users`;

  const recentPayload = {
    [uuid]: FieldValue.delete(),
  };

  return db.sequelize.transaction(async (tx) => {
    const queryOption = {
      where: {
        id: uuid,
      },
      transaction: tx,
    };

    const group = await Group.instance.findOne(queryOption);

    if (!group || !isUserInGroup(group, senderId)) return;

    await Group.instance.destroy(queryOption);

    const { firestore } = Firebase.instance;

    // Remove collections
    await Promise.all(
      _.map(group?.dataValues?.members ?? [], (member) =>
        Firebase.instance.deleteCollection(
          `${basePath}/${member}/groups/${uuid}/messages`
        )
      )
    );

    // Remove docs
    await Promise.all(
      _.map(group?.dataValues?.members ?? [], (member) =>
        firestore.doc(`${basePath}/${member}/groups/${uuid}`).delete()
      )
    );

    // Remove From Recent
    return Promise.all(
      _.map(group?.dataValues.members ?? [], (member) => {
        firestore
          .doc(`${basePath}/${member}`)
          .set(recentPayload, { merge: true });
      })
    );
  });
}
