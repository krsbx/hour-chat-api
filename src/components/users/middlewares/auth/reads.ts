import _ from 'lodash';
import asyncMw from 'express-asyncmw';
import { z } from 'zod';
import { createNotFoundResponse } from '@krsbx/response-formatter';
import schema from '../../../../shares/schema';
import User from '../../models';
import { BaseUserModel } from '../../models/attributes';

export const getUserByPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.auth)['loginUserSchema']>;
}>(async (req, res, next) => {
  let user: BaseUserModel | null = null;

  if (req.body.email) {
    user = await User.instance.findOne({ where: { email: req.body.email } });
  }

  if (req.body.username && !user) {
    user = await User.instance.findOne({
      where: { username: req.body.username },
    });
  }

  if (!user) {
    return res
      .status(404)
      .json(
        createNotFoundResponse(
          `User with ${_.compact([
            req.body.username && `username '${req.body.username}'`,
            req.body.email && `email '${req.body.email}'`,
          ]).join(' or ')} doesn't exists`
        )
      );
  }

  req.user = user;

  return next();
});
