import { Router } from 'express';
import userMiddlewares from '../../users/middlewares';
import middlewares from '../middlewares';

const router = Router();

// POST /stories
router.post(
  '/',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validateStoryPayloadMw,
  middlewares.create.createStoryMw
);

// POST /stories/:uuid/like
router.post(
  '/:uuid/like',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.read.getStoryByUuidMw,
  middlewares.update.likeStoryMw
);

// POST /stories/:uuid/dislike
router.post(
  '/:uuid/dislike',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.read.getStoryByUuidMw,
  middlewares.update.dislikeStoryMw
);

// PATCH /stories/:uuid
router.patch(
  '/:uuid',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validateStoryPayloadMw,
  middlewares.read.getStoryByUuidMw,
  middlewares.common.validateUserAccessMw,
  middlewares.update.updateStoryMw
);

// DELETE /stories/:uid
router.delete(
  '/:uid',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.read.getStoryByUuidMw,
  middlewares.common.validateUserAccessMw,
  middlewares.delete.deleteStoryMw
);

export default router;
