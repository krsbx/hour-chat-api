import asyncMw from 'express-asyncmw';
import { UserAttribute } from '../../users/models/attributes';
import User from '../../users/models';

export const updateUserStatusMw = asyncMw<{
  extends: {
    user: Pick<UserAttribute, 'id' | 'email' | 'isEmailVerified'>;
  };
}>(async (req, res, next) => {
  await User.instance.update(
    {
      isEmailVerified: true,
    },
    {
      where: {
        id: req.user.id,
      },
    }
  );

  return next();
});
