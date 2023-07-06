import _ from 'lodash';
import { BaseGroupModel } from '../../groups/models/attributes';
import { createOrUseEncryption } from '../../encryptions/events';
import { CHAT_TYPE } from '../../../shares/constant';
import { EncryptionAttribute } from '../../encryptions/models/attributes';
import { encryptText } from '../../encryptions/utils/common';

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

  const encryption = await createOrUseEncryption(payload);

  return encryption;
}

export function encryptMessageMetadata(
  payload: CreateOptional<HourChat.Firestore.MessageData, 'body' | 'files'>,
  config: EncryptionAttribute
) {
  const clone = {
    ...payload,
    body: encryptText(payload.body ?? '', config),
    files: (payload.files ?? []).map((file) => ({
      ...file,
      uri: encryptText(file.uri, config),
    })),
  };

  return clone;
}
