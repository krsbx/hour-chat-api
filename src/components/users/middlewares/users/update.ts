import _ from 'lodash';
import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import schema from '../../../../shares/schema';
import User from '../../models';
import { BaseUserModel } from '../../models/attributes';

export const updateUserMw = asyncMw<{
  body: z.infer<(typeof schema.users)['updateUserSchema']>;
  extends: {
    user: BaseUserModel;
  };
}>(async (req, res, next) => {
  const resource = await User.instance.factory.resourceToModel(req.body);

  if (_.isEmpty(resource)) return next();

  const [, [user]] = await User.instance.update(resource, {
    returning: true,
    where: {
      id: req.user.dataValues.id,
    },
  });

  req.user = user;

  return next();
});
