import asyncMw from 'express-asyncmw';
import { createNotFoundResponse } from '@krsbx/response-formatter';
import User from '../../models';
import { BaseUserModel } from '../../models/attributes';

export const getUserMw = asyncMw<{
  params: {
    id: string;
  };
  extends: {
    user: BaseUserModel;
  };
}>(async (req, res, next) => {
  const user = await User.instance.findOne({
    where: {
      id: req.params.id,
    },
  });

  if (!user) {
    return res
      .json(400)
      .json(createNotFoundResponse(`User with id ${req.params.id}`));
  }

  req.user = user;

  return next();
});

export const getUsersMw = asyncMw<{
  extends: {
    users: {
      rows: BaseUserModel[];
      count: number;
    };
  };
}>(async (req, res, next) => {
  const users = await User.instance.factory.findAll(
    {},
    req.filterQueryParams,
    req.query
  );

  req.users = users;

  return next();
});
