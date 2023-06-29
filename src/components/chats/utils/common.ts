import _ from 'lodash';
import { BaseGroupModel } from '../../groups/models/attributes';
import db from '../../../models';
import Group from '../../groups/models';
import { createOrUseEncryption } from '../../encryptions/events';
import { CHAT_TYPE } from '../../../shares/constant';

export function isUserInGroup(payload: BaseGroupModel, senderId: string) {
  if (!payload) return false;

  const { members } = payload.dataValues;

  if (!members.length) return false;

  return _.includes(members, senderId);
}

export async function getGroupEncryption(uuid: string) {
  const payload = {
    receiverId: uuid,
    senderId: uuid,
    type: CHAT_TYPE.GROUP,
  };

  const [group, encryption] = await db.sequelize.transaction(async (tx) => {
    const queryOption = {
      where: {
        id: uuid,
      },
      transaction: tx,
    };

    return Promise.all([
      Group.instance.findOne(queryOption),
      createOrUseEncryption(payload, tx),
    ]);
  });

  return [group, encryption] as const;
}
