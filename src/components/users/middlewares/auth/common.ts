import asyncMw from 'express-asyncmw';
import { z } from 'zod';
import { createUnauthorizedResponse } from '@krsbx/response-formatter';
import schema from '../../../../shares/schema';
import { omit } from '../../../../shares/common';
import { BaseUserModel, UserAttribute } from '../../models/attributes';
import { signAccessToken, verifyAccessToken } from '../../utils/jwt';

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

export const validateUserAccessTokenMw = asyncMw<{
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res, next) => {
  const authorization = req.headers.authorization
    ? req.headers.authorization.split(' ').pop()
    : null;

  if (!authorization) {
    return res.status(401).json(createUnauthorizedResponse());
  }

  const tokenPayload = await verifyAccessToken<Omit<UserAttribute, 'password'>>(
    authorization
  );

  req.currentUser = tokenPayload;

  return next();
});

export const validateUserAccessMw = asyncMw<{
  params: {
    id: string;
  };
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res, next) => {
  if (req.currentUser.id !== +req.params.id)
    return res.status(401).json(createUnauthorizedResponse());

  return next();
});

export const validateUserAccessByUserIdMw = asyncMw<{
  params: {
    userId: string;
  };
  extends: {
    currentUser: Omit<UserAttribute, 'password'>;
  };
}>(async (req, res, next) => {
  if (req.currentUser.id !== +req.params.userId)
    return res.status(401).json(createUnauthorizedResponse());

  return next();
});
