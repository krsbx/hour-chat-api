import { Router } from 'express';
import middlewares from '../middlewares';

const router = Router();

// POST /chats/private/send
router.post(
  '/private/send',
  middlewares.common.validatePrivateMessagePayloadMw,
  middlewares.read.checkPrivateMessageUsersExistsMw,
  middlewares.create.sendPrivateMessageMw
);

// POST /chats/private/typing
router.post(
  '/private/typing',
  middlewares.common.validatePrivateMessageTypingPayloadMw,
  middlewares.update.updatePrivateMessageTypingMw
);

// POST /chats/group
router.post(
  '/group',
  middlewares.common.validateCreateGroupMessagePayloadMw,
  middlewares.read.checkGroupMessageUsersExistsMw,
  middlewares.create.createGroupMessageGroupMw
);

// POST /chats/group/send
router.post(
  '/group/send',
  middlewares.common.validateGroupMessagePayloadMw,
  middlewares.create.sendGroupMessageMw
);

// POST /chats/group/typing
router.post(
  '/group/typing',
  middlewares.common.validateGroupMessageTypingPayloadMw,
  middlewares.update.updateGroupMessageTypingMw
);

export default router;
