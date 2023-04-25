import { Router } from 'express';
import middlewares from '../middlewares';
import userMiddlewares from '../../users/middlewares';

const router = Router();

// POST /device-tokens/:userId
router.post(
  '/:userId',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  userMiddlewares.auth.common.validateUserAccessByUserIdMw,
  middlewares.common.validateDeviceTokenPayloadMw,
  middlewares.create.createDeviceTokenMw,
  middlewares.response.returnDeviceTokenMw
);

// GET /device-tokens
router.get(
  '/',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.read.getDeviceTokensMw,
  middlewares.response.returnDeviceTokensMw
);

// GET /device-tokenss/:userId
router.get(
  '/:userId',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  userMiddlewares.auth.common.validateUserAccessByUserIdMw,
  middlewares.read.getDeviceTokenMw,
  middlewares.response.returnDeviceTokenMw
);

// DELETE /device-tokens/:userId
router.delete(
  '/:userId',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  userMiddlewares.auth.common.validateUserAccessByUserIdMw,
  middlewares.read.getDeviceTokenMw,
  middlewares.delete.deleteDeviceTokenMw
);

export default router;
