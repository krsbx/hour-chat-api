import asyncMw from 'express-asyncmw';
import { createCodeStatus } from '@krsbx/response-formatter';
import { BaseDeviceTokenModel } from '../models/attributes';
import DeviceToken from '../models';

export const deleteDeviceTokenMw = asyncMw<{
  extends: {
    deviceToken: BaseDeviceTokenModel;
  };
}>(async (req, res) => {
  await DeviceToken.instance.destroy({
    where: {
      id: req.deviceToken.dataValues.id,
    },
  });

  return res.json(200).json({
    ...createCodeStatus(200),
    message: 'Your account device token has been deleted successfully',
  });
});
