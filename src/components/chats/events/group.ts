import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import _ from 'lodash';
import { z } from 'zod';
import ENVIRONMENT from '../../../config/environment';
import Firebase from '../../../shares/Firebase';
import schema from '../../../shares/schema';
import Group from '../../groups/models';
import { BaseGroupModel } from '../../groups/models/attributes';

const basePath = `${ENVIRONMENT.CHAT_BASE_PATH}/groups/users`;

export async function createGroup(
  payload: z.infer<(typeof schema.chats)['createGroupSchema']>
) {
  const { name } = payload;
  const members = _.uniq(payload.members);

  const group = await Group.instance.create({
    name,
    members,
  });
  const uuid = group.dataValues.id;

  const information = {
    members,
    timestamp: Timestamp.now(),
    name,
    uuid,
  };

  const { firestore } = Firebase.instance;

  return Promise.all(
    _.map(members, (member) =>
      firestore.doc(`${basePath}/${member}`).set(
        {
          [uuid]: information,
        },
        { merge: true }
      )
    )
  );
}

export async function addMember(
  payload: z.infer<(typeof schema.chats)['modifyMemberSchema']>,
  group: BaseGroupModel
) {
  const { uuid } = payload;
  const newMember = _.isArray(payload.members)
    ? payload.members
    : [payload.members];
  const members = _.uniq([...group.dataValues.members, ...newMember]);

  const information = {
    members: FieldValue.arrayUnion(...members),
  };

  await group.update(
    {
      members,
    },
    {
      where: {
        id: uuid,
      },
    }
  );

  const { firestore } = Firebase.instance;

  return Promise.all(
    _.map(members, (member) =>
      firestore.doc(`${basePath}/${member}`).set(information, { merge: true })
    )
  );
}

export async function removeMember(
  payload: z.infer<(typeof schema.chats)['modifyMemberSchema']>,
  group: BaseGroupModel
) {
  const { uuid } = payload;
  const removedMembers = _.isArray(payload.members)
    ? payload.members
    : [payload.members];
  const members = group.dataValues.members.filter(
    (member) => !removedMembers.includes(member)
  );

  const information = {
    members: FieldValue.arrayRemove(...removedMembers),
  };

  const removedInformation = {
    [uuid]: FieldValue.delete(),
  };

  await group.update(
    {
      members,
    },
    {
      where: {
        id: uuid,
      },
    }
  );

  const { firestore } = Firebase.instance;

  return Promise.all([
    ..._.map(members, (member) =>
      firestore.doc(`${basePath}/${member}`).set(information, { merge: true })
    ),
    ..._.map(removedMembers, (member) =>
      firestore
        .doc(`${basePath}/${member}`)
        .set(removedInformation, { merge: true })
    ),
  ]);
}

export async function removeGroup(
  payload: z.infer<(typeof schema.chats)['removeGroupSchema']>,
  group: BaseGroupModel
) {
  const { uuid } = payload;
  const members = [...group.dataValues.members];

  const information = {
    [uuid]: FieldValue.delete(),
  };

  await group.destroy();

  const { firestore } = Firebase.instance;

  return Promise.all(
    _.map(members, (member) =>
      firestore.doc(`${basePath}/${member}`).set(information, { merge: true })
    )
  );
}
