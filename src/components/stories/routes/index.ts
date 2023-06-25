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

// POST /stories/:storyId/like
router.post(
  '/:storyId/like',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.read.getStoryByStoryIdMw,
  middlewares.update.likeStoryMw
);

// POST /stories/:storyId/dislike
router.post(
  '/:storyId/dislike',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.read.getStoryByStoryIdMw,
  middlewares.update.dislikeStoryMw
);

// PATCH /stories/:storyId
router.patch(
  '/:storyId',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validateStoryPayloadMw,
  middlewares.read.getStoryByStoryIdMw,
  middlewares.common.validateUserAccessMw,
  middlewares.update.updateStoryMw
);

// DELETE /stories/:uid
router.delete(
  '/:uid',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.read.getStoryByStoryIdMw,
  middlewares.common.validateUserAccessMw,
  middlewares.delete.deleteStoryMw
);

export default router;
