import { Router } from 'express';
import middlewares from '../middlewares';
import userMiddlewares from '../../users/middlewares';

const router = Router();

// POST /chats/private/send
router.post(
  '/private/send',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validatePrivateMessagePayloadMw,
  middlewares.read.checkPrivateMessageUsersExistsMw,
  middlewares.create.sendPrivateMessageMw
);

// POST /chats/private/typing
router.post(
  '/private/typing',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validatePrivateMessageTypingPayloadMw,
  middlewares.update.updatePrivateMessageTypingMw
);

// POST /chats/group
router.post(
  '/group',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validateCreateGroupMessagePayloadMw,
  middlewares.read.checkGroupMessageUsersExistsMw,
  middlewares.create.createGroupMessageGroupMw
);

// POST /chats/group/send
router.post(
  '/group/send',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validateGroupMessagePayloadMw,
  middlewares.create.sendGroupMessageMw
);

// POST /chats/group/typing
router.post(
  '/group/typing',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validateGroupMessageTypingPayloadMw,
  middlewares.update.updateGroupMessageTypingMw
);

export default router;
