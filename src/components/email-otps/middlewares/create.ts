import { config as dotenvConfig } from 'dotenv';
import asyncMw from 'express-asyncmw';
import moment from 'moment';
import { UserAttribute } from '../../users/models/attributes';
import { BaseEmailOtpModel } from '../models/attributes';
import EmailOtp from '../models';
import db from '../../../models';
import Email from '../../emails/models';
import { sendEmail } from '../../emails/events';
import { generateOtp } from '../utils/common';

dotenvConfig();

export const createEmailOtpMw = asyncMw<{
  extends: {
    user: Pick<UserAttribute, 'id' | 'email' | 'isEmailVerified'>;
    emailOtp: BaseEmailOtpModel | null;
  };
}>(async (req, res, next) => {
  if (req.emailOtp) return next();

  const emailOtp = await db.sequelize.transaction(async (tx) => {
    const code = generateOtp().toString();

    const [emailOtp, email] = await Promise.all([
      EmailOtp.instance.create(
        {
          userId: req.user.id,
          validUntil: moment().add(1, 'hour').toDate(),
          code,
        },
        { transaction: tx }
      ),
      Email.instance.create({
        content: `Please enter ${code} on the Hour Chat App to validate your account!`,
        receiver: req.user.email,
        sender: 'Hour Chat <noreply@hour-chat.com>',
        subject: 'Email Verification',
      }),
    ]);

    await sendEmail(email);

    return emailOtp;
  });

  req.emailOtp = emailOtp;

  return next();
});
