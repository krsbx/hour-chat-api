import { createCodeStatus } from '@krsbx/response-formatter';
import asyncMw from 'express-asyncmw';
import User from '../../models';
import { BaseUserModel } from '../../models/attributes';
import db from '../../../../models';
import DeviceToken from '../../../device-tokens/models';
import UserLocation from '../../../user-locations/models';
import EmailOtp from '../../../email-otps/models';

export const deleteUserMw = asyncMw<{
  extends: {
    user: BaseUserModel;
  };
}>(async (req, res) => {
  await db.sequelize.transaction(async (tx) => {
    const payload = {
      email: null,
      phoneNumber: null,
      username: null,
    };
    const queryOption = {
      where: {
        userId: req.user.dataValues.id,
      },
      transaction: tx,
    };

    return Promise.all([
      User.instance.update(payload, {
        where: {
          id: req.user.dataValues.id,
        },
        transaction: tx,
      }),
      DeviceToken.instance.destroy(queryOption),
      EmailOtp.instance.destroy(queryOption),
      UserLocation.instance.destroy(queryOption),
    ]);
  });

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Your account has been deleted successfully',
  });
});
