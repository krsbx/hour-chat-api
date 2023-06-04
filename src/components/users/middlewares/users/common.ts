import asyncMw from 'express-asyncmw';
import { z } from 'zod';
import schema from '../../../../shares/schema';

export const validateCreateUserPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.users)['createUserSchema']>;
}>(async (req, res, next) => {
  req.body = await schema.users.createUserSchema.parseAsync(req.body);

  return next();
});

export const validateUpdateUserPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.users)['updateUserSchema']>;
}>(async (req, res, next) => {
  req.body = await schema.users.updateUserSchema.parseAsync(req.body);

  return next();
});
