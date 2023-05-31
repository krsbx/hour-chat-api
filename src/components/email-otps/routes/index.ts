import { Router } from 'express';
import middlewares from '../middlewares';
import userMiddlewares from '../../users/middlewares';

const router = Router();

// POST /email-otps
router.post(
  '/',
  userMiddlewares.auth.common.validateUserEmailTokenMw,
  middlewares.read.getUserMw,
  middlewares.read.getEmailOtpMw,
  middlewares.create.createEmailOtpMw,
  middlewares.response.returnSuccessEmailOtpMw
);

// POST /email-otps/verify
router.post(
  '/verify',
  userMiddlewares.auth.common.validateUserEmailTokenMw,
  middlewares.read.getUserMw,
  middlewares.read.getEmailOtpMw,
  middlewares.common.validateEmailOtpMw,
  middlewares.update.updateUserStatusMw,
  middlewares.response.returnSuccessEmailOtpMw
);

export default router;
