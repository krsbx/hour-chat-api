import { Router } from 'express';
import middlewares from '../middlewares';
import userMiddlewares from '../../users/middlewares';

const router = Router();

// POST /files/upload
router.post(
  '/upload',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.uploadMw,
  middlewares.common.uploadToStorageMw
);

export default router;
