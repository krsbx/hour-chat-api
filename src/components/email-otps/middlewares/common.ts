import moment from 'moment';
import asyncMw from 'express-asyncmw';
import { createBadRequestResponse } from '@krsbx/response-formatter';
import { BaseEmailOtpModel } from '../models/attributes';
import EmailOtp from '../models';

export const validateEmailOtpMw = asyncMw<{
  reqQuery: {
    code?: string;
  };
  extends: {
    emailOtp: BaseEmailOtpModel | null;
  };
}>(async (req, res, next) => {
  if (!req.query.code || !req.emailOtp)
    return res.status(400).json(createBadRequestResponse());

  if (req.emailOtp.dataValues.code !== req.query.code)
    return res.status(400).json(createBadRequestResponse());

  const isOtpExpired = moment(req.emailOtp.dataValues.validUntil).isBefore(
    new Date()
  );

  if (isOtpExpired) {
    await EmailOtp.instance.destroy({
      where: {
        id: req.emailOtp.dataValues.id,
      },
    });

    return res.status(400).json(createBadRequestResponse());
  }

  return next();
});
