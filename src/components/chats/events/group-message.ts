import { z } from 'zod';
import _ from 'lodash';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import schema from '../../../shares/schema';
import Firebase from '../../../shares/Firebase';
import ENVIRONMENT from '../../../config/environment';

const chatBasePath = ENVIRONMENT.CHAT_BASE_PATH;

function isUserInGroup(
  payload: { members: number[] } | undefined,
  senderId: number
) {
  if (!payload?.members?.length) return false;

  return _.includes(payload.members, senderId);
}

async function getGroupInformation(groupPath: string) {
  const { firestore } = Firebase.instance;
  const group = await firestore.doc(groupPath).get();

  if (!group.exists) return;

  const groupData = group.data() as
    | { members: number[]; timestamp: Timestamp }
    | undefined;

  return groupData;
}

export async function createGroupMessageGroup(
  payload: z.infer<(typeof schema.chats)['createGroupMessageSchema']>
) {
  const { members, name } = payload;

  const admin = [...members].shift() as number;

  const basePath = `${chatBasePath}/groups/users`;
  const timestamp = Timestamp.now();

  const informationData = {
    members: _.uniq(members),
    timestamp,
    name,
  };

  const { firestore } = Firebase.instance;

  const docRef = await firestore
    .collection(`${basePath}/${admin}/groups`)
    .add(informationData);
  const uuid = docRef.id;

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
  const { body, senderId, uuid } = payload;

  const basePath = `${chatBasePath}/groups/users`;
  const timestamp = Timestamp.now();

  const informationData = {
    timestamp,
  };
  const messageData = {
    senderId,
    body,
    timestamp,
  };

  const { firestore } = Firebase.instance;
  const group = await getGroupInformation(
    `${basePath}/${senderId}/groups/${uuid}`
  );

  if (!isUserInGroup(group, senderId)) return;

  return Promise.all(
    _.map(group?.members ?? [], (member) => {
      const baseMemberPath = `${basePath}/${member}`;
      const groupPath = `${baseMemberPath}/groups/${uuid}`;

      return Promise.all([
        firestore.collection(`${groupPath}/messages`).add(messageData),
        firestore.doc(groupPath).set(informationData, { merge: true }),
        firestore.doc(baseMemberPath).set(
          {
            [uuid]: messageData,
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

  const informationData = {
    typing,
  };

  const { firestore } = Firebase.instance;
  const group = await getGroupInformation(
    `${basePath}/${senderId}/groups/${uuid}`
  );

  if (!isUserInGroup(group, senderId)) return;

  return Promise.all(
    _.map(group?.members ?? [], (member) =>
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
  ) as number[];
  const basePath = `${chatBasePath}/groups/users`;

  const informationData = {
    members: FieldValue.arrayRemove(...members),
  };

  const { firestore } = Firebase.instance;
  const group = await getGroupInformation(
    `${basePath}/${senderId}/groups/${uuid}`
  );

  if (!isUserInGroup(group, senderId)) return;

  return Promise.all([
    ..._.map(group?.members ?? [], (member) =>
      firestore
        .doc(`${basePath}/${member}/groups/${uuid}`)
        .set(informationData, { merge: true })
    ),
    ..._.map(members, (member) =>
      firestore.doc(`${basePath}/${member}/groups/${uuid}`).delete()
    ),
  ]);
}

export async function removeGroup(
  payload: z.infer<(typeof schema.chats)['removeGroupSchema']>
) {
  const { uuid, senderId } = payload;
  const basePath = `${chatBasePath}/groups/users`;

  const { firestore } = Firebase.instance;
  const group = await getGroupInformation(
    `${basePath}/${senderId}/groups/${uuid}`
  );

  if (!isUserInGroup(group, senderId)) return;

  // Remove collections
  await Promise.all(
    _.map(group?.members ?? [], (member) =>
      Firebase.instance.deleteCollection(
        `${basePath}/${member}/groups/${uuid}/messages`
      )
    )
  );

  // Remove docs
  return Promise.all(
    _.map(group?.members ?? [], (member) =>
      firestore.doc(`${basePath}/${member}/groups/${uuid}`).delete()
    )
  );
}
