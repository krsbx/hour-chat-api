import { Router } from 'express';
import middlewares from '../middlewares';

const router = Router();

// POST /device-tokens/:userId
router.post(
  '/:userId',
  middlewares.common.validateDeviceTokenPayloadMw,
  middlewares.create.createDeviceTokenMw,
  middlewares.response.returnDeviceTokenMw
);

// GET /device-tokens
router.get(
  '/',
  middlewares.read.getDeviceTokensMw,
  middlewares.response.returnDeviceTokensMw
);

// GET /device-tokenss/:userId
router.get(
  '/:userId',
  middlewares.read.getDeviceTokenMw,
  middlewares.response.returnDeviceTokenMw
);

// DELETE /device-tokens/:userId
router.delete(
  '/:userId',
  middlewares.read.getDeviceTokenMw,
  middlewares.delete.deleteDeviceTokenMw
);

export default router;
