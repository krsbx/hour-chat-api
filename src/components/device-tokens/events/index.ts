import _ from 'lodash';
import { Op } from 'sequelize';
import DeviceToken from '../models';
import Firebase from '../../../shares/Firebase';

export async function notifyUser(
  receiverId: string,
  payload: {
    title: string;
    body: string;
    senderId: string;
  }
) {
  const deviceToken = await DeviceToken.instance.findOne({
    where: {
      userId: receiverId,
    },
  });

  if (!deviceToken || !deviceToken.dataValues.token) return;

  return Firebase.instance.sendNotification(
    deviceToken.dataValues.token,
    payload
  );
}

export async function notifyUsers(
  receiverIds: string[],
  payload: {
    title: string;
    body: string;
    senderId: string;
  }
) {
  const deviceTokens = await DeviceToken.instance.findAll({
    where: {
      userId: {
        [Op.in]: receiverIds,
      },
    },
  });

  if (!deviceTokens.length) return;

  const tokens = _.compact(
    deviceTokens.map(({ dataValues }) => dataValues.token)
  );

  return Firebase.instance.sendNotifications(tokens, payload);
}
