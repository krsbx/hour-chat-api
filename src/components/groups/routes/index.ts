import { Router } from 'express';
import middlewares from '../middlewares';
import userMiddlewares from '../../users/middlewares';

const router = Router();

// GET /groups
router.get(
  '/',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.read.getGroupsMw,
  middlewares.response.returnGroupsMw
);

// GET /groups/:groupId
router.get(
  '/:groupId',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.read.getGroupByGroupIdMw,
  middlewares.response.returnGroupMw
);

export default router;
