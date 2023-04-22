import { z } from 'zod';
import asyncMw from 'express-asyncmw';
import User from '../../models';
import { BaseUserModel } from '../../models/attributes';
import { createUserSchema } from '../../../../shares/schema/users';

export const createUserMw = asyncMw<{
  reqBody: z.infer<typeof createUserSchema>;
  extends: {
    user: BaseUserModel;
  };
}>(async (req, res, next) => {
  const resource = await User.instance.factory.resourceToModel(req.body);

  req.user = await User.instance.create(resource);

  return next();
});
