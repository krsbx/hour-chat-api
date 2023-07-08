import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import ENVIRONMENT from '../../../config/environment';
import Firebase from '../../../shares/Firebase';
import { CHAT_TYPE } from '../../../shares/constant';
import schema from '../../../shares/schema';
import { createOrUseEncryption } from '../../encryptions/events';
import { BaseGroupModel } from '../../groups/models/attributes';
import { encryptMessage, getSenderReceiverPath } from '../utils/common';

export async function sendPrivateMessage(
  payload: z.infer<(typeof schema.chats)['privateMessageSchema']>
) {
  const { sender, receiver } = getSenderReceiverPath(payload);
  const { receiverId, senderId, body, files } = payload;

  const encryption = await createOrUseEncryption({
    receiverId,
    senderId,
    type: CHAT_TYPE.PRIVATE,
  });

  const message = encryptMessage(
    _.defaults(
      {
        body,
        files,
        senderId,
        timestamp: Timestamp.now(),
      },
      {
        body: '',
        files: [],
      }
    ),
    encryption.dataValues
  );

  const { firestore } = Firebase.instance;

  const promises = [
    // Sender Side
    firestore.doc(sender.path).set(
      {
        [receiverId]: {
          ...message,
          uuid: senderId,
          total: FieldValue.increment(1),
        },
      },
      { merge: true }
    ),
    firestore.doc(sender.message).set(message, {
      merge: true,
    }),
  ];

  // Receiver Side
  if (senderId !== receiverId) {
    promises.push(
      firestore.doc(receiver.path).set(
        {
          [senderId]: {
            ...message,
            uuid: receiverId,
            total: FieldValue.increment(1),
          },
        },
        { merge: true }
      ),
      firestore.doc(receiver.message).set(message, {
        merge: true,
      })
    );
  }

  return Promise.all(promises);
}

export async function sendGroupMessage(
  payload: z.infer<(typeof schema.chats)['groupMessageSchema']>,
  group: BaseGroupModel
) {
  const { senderId, uuid, body, files } = payload;
  const basePath = `${ENVIRONMENT.CHAT_BASE_PATH}/groups/users`;
  const messageUuid = uuidv4();

  const encryption = await createOrUseEncryption({
    receiverId: uuid,
    senderId: uuid,
    type: CHAT_TYPE.GROUP,
  });

  const message = encryptMessage(
    _.defaults(
      {
        body,
        files,
        senderId,
        timestamp: Timestamp.now(),
      },
      {
        body: '',
        files: [],
      }
    ),
    encryption.dataValues
  );

  const { firestore } = Firebase.instance;

  return Promise.all(
    _.map(group.dataValues.members, (member) => {
      const memberPath = `${basePath}/${member}`;
      const groupPath = `${memberPath}/groups/${uuid}`;

      return Promise.all([
        firestore
          .doc(`${groupPath}/messages/${messageUuid}`)
          .set(message, { merge: true }),
        firestore.doc(memberPath).set(
          {
            [uuid]: {
              ...message,
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
