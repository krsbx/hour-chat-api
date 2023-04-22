import asyncMw from 'express-asyncmw';
import { ZodError, z } from 'zod';
import schema from '../../../../shares/schema';
import { omit, pick } from '../../../../shares/common';
import { BaseUserModel } from '../../models/attributes';
import { signAccessToken } from '../../utils/jwt';

export const validateUserLoginPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema)['auth']['loginUserSchema']>;
}>(async (req, res, next) => {
  try {
    await schema.auth.loginUserSchema.parseAsync(req.body);

    return next();
  } catch (err) {
    if (err instanceof ZodError) {
      return res
        .status(400)
        .json(pick(err, ['name', 'message', 'stack', 'errors']));
    }

    return next(err);
  }
});

export const createUserAccessTokenMw = asyncMw<{
  extends: {
    user: BaseUserModel;
    token: string;
  };
}>(async (req, res, next) => {
  try {
    const token = signAccessToken(
      omit(req.user.dataValues, ['password']),
      true
    );

    req.token = token;
  } catch (err) {
    return next(err);
  }
});
