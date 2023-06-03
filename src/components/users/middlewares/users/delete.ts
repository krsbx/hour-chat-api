import { createCodeStatus } from '@krsbx/response-formatter';
import asyncMw from 'express-asyncmw';
import User from '../../models';
import { BaseUserModel } from '../../models/attributes';

export const deleteUserMw = asyncMw<{
  extends: {
    user: BaseUserModel;
  };
}>(async (req, res) => {
  await User.instance.destroy({
    where: {
      id: req.user.dataValues.id,
    },
  });

  return res.status(200).json({
    ...createCodeStatus(200),
    message: 'Your account has been deleted successfully',
  });
});
