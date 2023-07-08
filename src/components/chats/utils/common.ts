import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { CHAT_TYPE } from '../../../shares/constant';
import { createOrUseEncryption } from '../../encryptions/events';
import { EncryptionAttribute } from '../../encryptions/models/attributes';
import { encryptText } from '../../encryptions/utils/common';
import { BaseGroupModel } from '../../groups/models/attributes';
import ENVIRONMENT from '../../../config/environment';

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

export function encryptMessage(
  payload: HourChat.Firestore.MessageData,
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

export function getSenderReceiverPath(payload: {
  senderId: string;
  receiverId: string;
}) {
  const { receiverId, senderId } = payload;

  const messageUuid = uuidv4();

  const basePath = `${ENVIRONMENT.CHAT_BASE_PATH}/privates/users`;
  const sender = {
    get path() {
      return `${basePath}/${senderId}`;
    },
    get information() {
      return `${this.path}/${receiverId}/information`;
    },
    get message() {
      return `${this.information}/messages/${messageUuid}`;
    },
  };
  const receiver = {
    get path() {
      return `${basePath}/${receiverId}`;
    },
    get information() {
      return `${this.path}/${senderId}/information`;
    },
    get message() {
      return `${this.information}/messages/${messageUuid}`;
    },
  };

  return {
    sender,
    receiver,
  };
}
