import asyncMw from 'express-asyncmw';
import { z } from 'zod';
import schema from '../../../../shares/schema';
import { omit } from '../../../../shares/common';
import { BaseUserModel } from '../../models/attributes';
import { signAccessToken } from '../../utils/jwt';

export const validateUserLoginPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.auth)['loginUserSchema']>;
}>(async (req, res, next) => {
  await schema.auth.loginUserSchema.parseAsync(req.body);

  return next();
});

export const createUserAccessTokenMw = asyncMw<{
  extends: {
    user: BaseUserModel;
    token: string;
  };
}>(async (req, res, next) => {
  const token = signAccessToken(omit(req.user.dataValues, ['password']), true);

  req.token = token;

  return next();
});
