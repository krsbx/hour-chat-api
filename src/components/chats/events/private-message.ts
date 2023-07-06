import _ from 'lodash';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import schema from '../../../shares/schema';
import Firebase from '../../../shares/Firebase';
import ENVIRONMENT from '../../../config/environment';
import { createOrUseEncryption } from '../../encryptions/events';
import { CHAT_TYPE } from '../../../shares/constant';
import { encryptMessageMetadata } from '../utils/common';

const chatBasePath = ENVIRONMENT.CHAT_BASE_PATH;

function createSenderReceiverPath(
  payload: Omit<z.infer<(typeof schema.chats)['privateMessageSchema']>, 'body'>
) {
  const { receiverId, senderId } = payload;

  const messageUuid = uuidv4();

  const basePath = `${chatBasePath}/privates/users`;
  const senderObj = {
    basePath: `${basePath}/${senderId}`,
    get informationPath() {
      return `${this.basePath}/${receiverId}/information`;
    },
    get messagePath() {
      return `${this.informationPath}/messages/${messageUuid}`;
    },
  };
  const receiverObj = {
    basePath: `${basePath}/${receiverId}`,
    get informationPath() {
      return `${this.basePath}/${senderId}/information`;
    },
    get messagePath() {
      return `${this.informationPath}/messages/${messageUuid}`;
    },
  };

  return {
    senderObj,
    receiverObj,
  };
}

export async function sendPrivateMessage(
  payload: z.infer<(typeof schema.chats)['privateMessageSchema']>
) {
  const { senderId, receiverId } = payload;
  const { receiverObj, senderObj } = createSenderReceiverPath(payload);

  const encryptionPayload = {
    receiverId,
    senderId,
    type: CHAT_TYPE.PRIVATE,
  };

  const encryption = await createOrUseEncryption(encryptionPayload);

  const timestamp = Timestamp.now();

  const messageData = encryptMessageMetadata(
    {
      ..._.pick(payload, ['body', 'files']),
      senderId,
      timestamp,
    },
    encryption.dataValues
  );

  const { firestore } = Firebase.instance;

  return Promise.all([
    firestore.doc(senderObj.basePath).set(
      {
        [receiverId]: {
          ...messageData,
          uuid: senderId,
          total: FieldValue.increment(1),
        },
      },
      { merge: true }
    ),
    firestore.doc(receiverObj.basePath).set(
      {
        [senderId]: {
          ...messageData,
          uuid: receiverId,
          total: FieldValue.increment(1),
        },
      },
      { merge: true }
    ),
    firestore.doc(senderObj.messagePath).set(messageData, {
      merge: true,
    }),
    firestore.doc(receiverObj.messagePath).set(messageData, {
      merge: true,
    }),
  ]);
}

export async function updatePrivateMessageTyping(
  payload: z.infer<(typeof schema.chats)['privateMessageTypingSchema']>
) {
  const { receiverObj, senderObj } = createSenderReceiverPath(payload);
  const typing = payload.typing
    ? FieldValue.arrayUnion(payload.senderId)
    : FieldValue.arrayRemove(payload.senderId);

  const informationData = {
    typing,
  };

  const { firestore } = Firebase.instance;

  return Promise.all([
    firestore
      .doc(senderObj.informationPath)
      .set(informationData, { merge: true }),
    firestore
      .doc(receiverObj.informationPath)
      .set(informationData, { merge: true }),
  ]);
}
