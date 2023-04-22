import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import { ValidationError } from 'sequelize';
import User from '../../models';
import { BaseUserModel } from '../../models/attributes';
import { createUserSchema } from '../../../../shares/schema/users';
import { pick } from '../../../../shares/common';

export const createUserMw = asyncMw<{
  reqBody: z.infer<typeof createUserSchema>;
  extends: {
    user: BaseUserModel;
  };
}>(async (req, res, next) => {
  try {
    const resource = await User.instance.factory.resourceToModel(req.body);

    req.user = await User.instance.create(resource);

    return next();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res
        .status(400)
        .json(pick(err, ['name', 'message', 'stack', 'errors']));
    }

    return next(err);
  }
});
