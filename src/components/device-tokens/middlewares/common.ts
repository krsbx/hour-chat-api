import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import schema from '../../../shares/schema';

export const validateDeviceTokenPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.deviceTokens)['deviceTokenSchema']>;
}>(async (req, res, next) => {
  req.body = await schema.deviceTokens.deviceTokenSchema.parseAsync(req.body);

  return next();
});
