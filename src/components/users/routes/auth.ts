import { Router } from 'express';
import middlewares from '../middlewares';

const router = Router();

// /auth/login
router.post(
  '/login',
  middlewares.auth.common.validateUserLoginPayloadMw,
  middlewares.auth.read.getUserByPayloadMw,
  middlewares.auth.common.createUserAccessTokenMw,
  middlewares.auth.response.returnUserAccessTokenMw
);

// /auth/register
router.post(
  '/register',
  middlewares.users.common.validateCreateUserPayloadMw,
  middlewares.users.create.createUserMw,
  middlewares.users.response.returnUsersMw
);

export default router;
