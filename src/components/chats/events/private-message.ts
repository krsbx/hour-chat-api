import _ from 'lodash';
import { z } from 'zod';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import schema from '../../../shares/schema';
import Firebase from '../../../shares/Firebase';
import ENVIRONMENT from '../../../config/environment';
import { createOrUseEncryption } from '../../encryptions/events';
import { CHAT_TYPE } from '../../../shares/constant';
import { encryptMessageMetadata } from '../utils/common';
import { notifyUser } from '../../device-tokens/events';
import User from '../../users/models';
import { createFullName } from '../../users/utils/common';

const chatBasePath = ENVIRONMENT.CHAT_BASE_PATH;

function createSenderReceiverPath(
  payload: Omit<z.infer<(typeof schema.chats)['privateMessageSchema']>, 'body'>
) {
  const { receiverId, senderId } = payload;

  const basePath = `${chatBasePath}/privates/users`;
  const senderObj = {
    basePath: `${basePath}/${senderId}`,
    get informationPath() {
      return `${this.basePath}/${receiverId}/information`;
    },
    get messagePath() {
      return `${this.informationPath}/messages`;
    },
  };
  const receiverObj = {
    basePath: `${basePath}/${receiverId}`,
    get informationPath() {
      return `${this.basePath}/${senderId}/information`;
    },
    get messagePath() {
      return `${this.informationPath}/messages`;
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
  const sender = await User.instance.findOne({
    where: { id: senderId },
  });

  const timestamp = Timestamp.now();

  const messageData = encryptMessageMetadata(
    {
      ..._.pick(payload, ['body', 'files']),
      senderId,
      timestamp,
    },
    encryption.dataValues
  );

  const notificationPayload = {
    title: createFullName(sender?.dataValues ?? null) ?? 'New message',
    body: payload.body ?? '',
    senderId,
  };

  if (_.isEmpty(notificationPayload.body) && payload.files?.length) {
    notificationPayload.body = `${payload.files.length} Files`;
  }

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
    firestore.collection(senderObj.messagePath).add(messageData),
    firestore.collection(receiverObj.messagePath).add(messageData),
    notifyUser(receiverId, notificationPayload),
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
