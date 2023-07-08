import { FieldValue } from 'firebase-admin/firestore';
import _ from 'lodash';
import { z } from 'zod';
import ENVIRONMENT from '../../../config/environment';
import Firebase from '../../../shares/Firebase';
import schema from '../../../shares/schema';
import { BaseGroupModel } from '../../groups/models/attributes';
import { getSenderReceiverPath } from '../utils/common';

export async function updatePrivateTyping(
  payload: z.infer<(typeof schema.chats)['privateTypingSchema']>
) {
  const { receiver, sender } = getSenderReceiverPath(payload);
  const typing = payload.typing
    ? FieldValue.arrayUnion(payload.senderId)
    : FieldValue.arrayRemove(payload.senderId);

  const information = {
    typing,
  };

  const { firestore } = Firebase.instance;

  return Promise.all([
    firestore.doc(sender.information).set(information, { merge: true }),
    firestore.doc(receiver.information).set(information, { merge: true }),
  ]);
}

export async function updateGroupTyping(
  payload: z.infer<(typeof schema.chats)['groupTypingSchema']>,
  group: BaseGroupModel
) {
  const { uuid, senderId } = payload;
  const typing = payload.typing
    ? FieldValue.arrayUnion(senderId)
    : FieldValue.arrayRemove(senderId);

  const basePath = `${ENVIRONMENT.CHAT_BASE_PATH}/groups/users`;

  const information = {
    typing,
  };

  const { firestore } = Firebase.instance;

  return Promise.all(
    _.map(group.dataValues.members, (member) =>
      firestore
        .doc(`${basePath}/${member}/groups/${uuid}`)
        .set(information, { merge: true })
    )
  );
}
