import { Router } from 'express';
import {
  createGroupRoute,
  groupTypingRoute,
  modifyMemberRoute,
  sendGroupMessageRoute,
} from './shared';

const router = Router();

// POST /chats/group
router.post('/', ...createGroupRoute);

// POST /chats/group/send
router.post('/send', ...sendGroupMessageRoute);

// POST /chats/group/typing
router.post('/typing', ...groupTypingRoute);

// POST /chats/group/member?adding=?
router.post('/member', ...modifyMemberRoute);

export default router;
