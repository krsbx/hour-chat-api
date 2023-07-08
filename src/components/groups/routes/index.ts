import { Router } from 'express';
import middlewares from '../middlewares';
import userMiddlewares from '../../users/middlewares';
import {
  createGroupRoute,
  groupTypingRoute,
  sendGroupMessageRoute,
} from '../../chats/routes/shared';
import { modifyGroupMemberMw } from '../../chats/middlewares/update';

const router = Router();

// POST /groups
router.post('/', ...createGroupRoute);

// POST /groups/:groupId/send
router.post(
  '/:groupId/send',
  middlewares.common.convertGroupIdToUuidPayloadMw,
  ...sendGroupMessageRoute
);

// POST /groups/:groupId/typing
router.post(
  '/:groupId/typing',
  middlewares.common.convertGroupIdToUuidPayloadMw,
  ...groupTypingRoute
);

// POST /groups/:groupId/member?adding=?
router.post(
  '/:groupId/member',
  middlewares.common.convertGroupIdToUuidPayloadMw,
  ...modifyGroupMemberMw
);

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
