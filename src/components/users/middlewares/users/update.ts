import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import { ValidationError } from 'sequelize';
import schema from '../../../../shares/schema';
import User from '../../models';
import { BaseUserModel } from '../../models/attributes';
import { pick } from '../../../../shares/common';

export const updateUserMw = asyncMw<{
  body: z.infer<(typeof schema.users)['updateUserSchema']>;
  extends: {
    user: BaseUserModel;
  };
}>(async (req, res, next) => {
  try {
    const resource = await User.instance.factory.resourceToModel(req.body);

    const [, [user]] = await User.instance.update(resource, {
      returning: true,
      where: {
        id: req.user.dataValues.id,
      },
    });

    req.user = user;
  } catch (err) {
    if (err instanceof ValidationError) {
      return res
        .status(400)
        .json(pick(err, ['name', 'message', 'stack', 'errors']));
    }

    return next(err);
  }
});
