import { Router } from 'express';
import middlewares from '../middlewares';
import userMiddlewares from '../../users/middlewares';

const router = Router();

// POST /user-locations/:userId
router.post(
  '/:userId',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  userMiddlewares.auth.common.validateUserAccessByUserIdMw,
  middlewares.common.validateUserLocationPayloadMw,
  middlewares.create.createUserLocationMw,
  middlewares.response.returnUserLocationMw
);

// GET /user-locations
router.get(
  '/',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.read.getUserLocationsMw,
  middlewares.response.returnUserLocationsMw
);

// GET /user-locationss/:userId
router.get(
  '/:userId',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  userMiddlewares.auth.common.validateUserAccessByUserIdMw,
  middlewares.read.getUserLocationMw,
  middlewares.response.returnUserLocationMw
);

// DELETE /user-locations/:userId
router.delete(
  '/:userId',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  userMiddlewares.auth.common.validateUserAccessByUserIdMw,
  middlewares.read.getUserLocationMw,
  middlewares.delete.deleteUserLocationMw
);

export default router;
