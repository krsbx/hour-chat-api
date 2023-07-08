import { Router } from 'express';
import privateRoute from './private';
import groupRoute from './group';

const router = Router();

// ALL /chats/private
router.use('/private', privateRoute);

// ALL /chats/group
router.use('/group', groupRoute);

export default router;
