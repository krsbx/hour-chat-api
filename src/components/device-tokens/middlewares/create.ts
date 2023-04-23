import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import schema from '../../../shares/schema';
import { BaseDeviceTokenModel } from '../models/attributes';
import DeviceToken from '../models';

export const createDeviceTokenMw = asyncMw<{
  reqBody: z.infer<(typeof schema.deviceTokens)['deviceTokenSchema']>;
  params: {
    userId: string;
  };
  extends: {
    deviceToken: BaseDeviceTokenModel;
  };
}>(async (req, res, next) => {
  const [deviceToken] = await DeviceToken.instance.upsert({
    userId: +req.params.userId,
    token: req.body.token,
  });

  req.deviceToken = deviceToken;

  return next();
});
