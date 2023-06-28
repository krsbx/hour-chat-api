import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import schema from '../../../shares/schema';

export const validateEncryptionQueryMw = asyncMw<{
  reqQuery: {
    senderId: string | number;
    receiverId: string | number;
    type: HourChat.Types.ChatType;
  };
  reqBody: z.infer<(typeof schema.encryptions)['encryptionQuery']>;
}>(async (req, res, next) => {
  req.body = await schema.encryptions.encryptionQuery.parseAsync({
    senderId: req.query.senderId,
    receiverId: req.query.receiverId,
    type: req.query.type,
  });

  return next();
});