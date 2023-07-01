import { Router } from 'express';
import middlewares from '../middlewares';
import userMiddlewares from '../../users/middlewares';

const router = Router();

// GET /encryptions?senderId=?&receiverId=?&type=?
router.get(
  '/',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validateEncryptionQueryMw,
  middlewares.read.getEncryptionMw,
  middlewares.common.checkUserAccessMw,
  middlewares.response.returnEncryptionMw
);

export default router;
