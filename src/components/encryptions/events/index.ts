import { Op, Transaction } from 'sequelize';
import Encryption from '../models';
import { createKeyIv } from '../utils/common';

export async function getEncryptionByType(
  {
    receiverId,
    senderId,
    type,
  }: {
    senderId: string | number;
    receiverId: string | number;
    type: HourChat.Types.ChatType;
  },
  transaction?: Transaction
) {
  const encryption = await Encryption.instance.findOne({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            {
              receiverId: `${receiverId}`,
              senderId: `${senderId}`,
            },
            {
              senderId: `${receiverId}`,
              receiverId: `${senderId}`,
            },
          ],
        },
        {
          type,
        },
      ],
    },
    transaction,
  });

  return encryption;
}

export async function createEncryption(
  {
    receiverId,
    senderId,
    type,
  }: {
    senderId: string | number;
    receiverId: string | number;
    type: HourChat.Types.ChatType;
  },
  transaction?: Transaction
) {
  const { key, iv } = createKeyIv();

  const encryption = await Encryption.instance.create(
    {
      receiverId: `${receiverId}`,
      senderId: `${senderId}`,
      type,
      key,
      iv,
    },
    {
      transaction,
    }
  );

  return encryption;
}

export async function createOrUseEncryption(
  payload: {
    senderId: string | number;
    receiverId: string | number;
    type: HourChat.Types.ChatType;
  },
  transaction?: Transaction
) {
  let encryption = await getEncryptionByType(payload, transaction);

  if (!encryption) encryption = await createEncryption(payload, transaction);

  return encryption;
}
