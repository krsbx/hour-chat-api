import asyncMw from 'express-asyncmw';
import { z } from 'zod';
import { createUnauthorizedResponse } from '@krsbx/response-formatter';
import schema from '../../../../shares/schema';
import { omit, pick } from '../../../../shares/common';
import { BaseUserModel, UserAttribute } from '../../models/attributes';
import { signJwtToken, verifyJwtToken } from '../../utils/jwt';

export const validateUserLoginPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.auth)['loginUserSchema']>;
}>(async (req, res, next) => {
  req.body = await schema.auth.loginUserSchema.parseAsync(req.body);

  return next();
});

export const createUserAccessTokenMw = asyncMw<{
  extends: {
    user: BaseUserModel;
    token: string;
  };
}>(async (req, res, next) => {
  const token = signJwtToken(omit(req.user.dataValues, ['password']), true);

  req.token = token;

  return next();
});

export const createUserEmailTokenMw = asyncMw<{
  extends: {
    user: BaseUserModel;
    token: string;
  };
}>(async (req, res, next) => {
  const token = signJwtToken(
    pick(req.user.dataValues, ['id', 'email', 'isEmailVerified']),
    true
  );

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

  const tokenPayload = await verifyJwtToken<Omit<UserAttribute, 'password'>>(
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
  if (req.currentUser.id !== req.params.id)
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
  if (req.currentUser.id !== req.params.userId)
    return res.status(401).json(createUnauthorizedResponse());

  return next();
});

export const validateUserEmailTokenMw = asyncMw<{
  extends: {
    currentUser: Pick<UserAttribute, 'id' | 'email' | 'isEmailVerified'>;
  };
}>(async (req, res, next) => {
  const authorization = req.headers.authorization
    ? req.headers.authorization.split(' ').pop()
    : null;

  if (!authorization) {
    return res.status(401).json(createUnauthorizedResponse());
  }

  const tokenPayload = await verifyJwtToken<
    Pick<UserAttribute, 'id' | 'email' | 'isEmailVerified'>
  >(authorization);

  req.currentUser = tokenPayload;

  return next();
});
