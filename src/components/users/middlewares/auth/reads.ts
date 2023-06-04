import _ from 'lodash';
import asyncMw from 'express-asyncmw';
import { z } from 'zod';
import {
  createBadRequestResponse,
  createNotFoundResponse,
} from '@krsbx/response-formatter';
import schema from '../../../../shares/schema';
import User from '../../models';
import { BaseUserModel } from '../../models/attributes';
import { compareText } from '../../utils/bcrypt';

export const getUserByPayloadMw = asyncMw<{
  reqBody: z.infer<(typeof schema.auth)['loginUserSchema']>;
  extends: {
    user: BaseUserModel;
  };
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

export const comparePasswordMw = asyncMw<{
  reqBody: z.infer<(typeof schema.auth)['loginUserSchema']>;
  extends: {
    user: BaseUserModel;
  };
}>(async (req, res, next) => {
  const isCorrect = await compareText({
    original: req.user.dataValues.password,
    text: req.body.password,
  });

  if (!isCorrect) {
    return res
      .status(400)
      .json(createBadRequestResponse(`Password doesn't match`));
  }

  return next();
});
