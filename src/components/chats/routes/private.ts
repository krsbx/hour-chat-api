import { Router } from 'express';
import middlewares from '../middlewares';
import userMiddlewares from '../../users/middlewares';

const router = Router();

// POST /chats/private/send
router.post(
  '/send',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validatePrivateMessagePayloadMw,
  middlewares.common.validateSenderPayloadMw,
  middlewares.read.checkPrivateMessageUsersExistsMw,
  middlewares.create.sendPrivateMessageMw
);

// POST /chats/private/typing
router.post(
  '/typing',
  userMiddlewares.auth.common.validateUserAccessTokenMw,
  middlewares.common.validatePrivateMessageTypingPayloadMw,
  middlewares.common.validateSenderPayloadMw,
  middlewares.update.updatePrivateMessageTypingMw
);

export default router;
