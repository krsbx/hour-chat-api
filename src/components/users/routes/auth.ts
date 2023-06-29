import { Router } from 'express';
import middlewares from '../middlewares';

const router = Router();

// POST /auth/login
router.post(
  '/login',
  middlewares.auth.common.validateUserLoginPayloadMw,
  middlewares.auth.read.getUserByPayloadMw,
  middlewares.auth.read.comparePasswordMw,
  middlewares.auth.common.createUserAccessTokenMw,
  middlewares.auth.response.returnUserTokenMw
);

// POST /auth/register
router.post(
  '/register',
  middlewares.users.common.validateCreateUserPayloadMw,
  middlewares.users.create.createUserMw,
  middlewares.auth.common.createUserAccessTokenMw,
  middlewares.auth.response.returnUserTokenMw
);

export default router;
