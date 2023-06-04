import asyncMw from 'express-asyncmw';
import { createBadRequestResponse } from '@krsbx/response-formatter';
import { UserAttribute } from '../../users/models/attributes';
import { BaseEmailOtpModel } from '../models/attributes';
import EmailOtp from '../models';
import User from '../../users/models';

export const getEmailOtpMw = asyncMw<{
  extends: {
    currentUser: Pick<UserAttribute, 'id' | 'email' | 'isEmailVerified'>;
    emailOtp: BaseEmailOtpModel | null;
  };
}>(async (req, res, next) => {
  if (req.currentUser.isEmailVerified)
    return res.status(400).json(createBadRequestResponse());

  const emailOtp = await EmailOtp.instance.findOne({
    where: {
      userId: req.currentUser.id,
    },
  });

  req.emailOtp = emailOtp;

  return next();
});

export const getUserMw = asyncMw<{
  extends: {
    currentUser: Pick<UserAttribute, 'id' | 'email' | 'isEmailVerified'>;
  };
}>(async (req, res, next) => {
  const user = await User.instance.findOne({
    where: {
      id: req.currentUser.id,
    },
  });

  if (!user || user.dataValues.isEmailVerified)
    return res.status(400).json(createBadRequestResponse());

  req.currentUser = user.dataValues;

  return next();
});
