import { z } from 'zod';
import { config as dotEnvConfig } from 'dotenv';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import schema from '../../../shares/schema';
import Firebase from '../../../shares/Firebase';

dotEnvConfig();

const chatBasePath = process.env.CHAT_BASE_PATH;

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
  const { body, senderId } = payload;
  const { receiverObj, senderObj } = createSenderReceiverPath(payload);

  const timestamp = Timestamp.now();

  const informationData = {
    timestamp,
  };
  const messageData = {
    senderId,
    timestamp,
    body,
  };

  const { firestore } = Firebase.instance;

  return Promise.all([
    firestore
      .doc(senderObj.informationPath)
      .set(informationData, { merge: true }),
    firestore
      .doc(receiverObj.informationPath)
      .set(informationData, { merge: true }),
    firestore.collection(senderObj.messagePath).add(messageData),
    firestore.collection(receiverObj.messagePath).add(messageData),
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
