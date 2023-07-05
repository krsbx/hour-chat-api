import { Router } from 'express';
import middlewares from '../middlewares';

const router = Router();

// POST /users
router.post(
  '/',
  middlewares.users.common.validateCreateUserPayloadMw,
  middlewares.users.create.createUserMw,
  middlewares.users.response.returnUserMw
);

// GET /users
router.get(
  '/',
  middlewares.auth.common.validateUserAccessTokenMw,
  middlewares.users.read.getUsersMw,
  middlewares.users.response.returnUsersMw
);

// GET /users/near-me
router.get(
  '/near-me',
  middlewares.auth.common.validateUserAccessTokenMw,
  middlewares.users.read.getNearMeUsersMw,
  middlewares.users.response.returnNearMeUsersMw
);

// GET /users/:id
router.get(
  '/:id',
  middlewares.auth.common.validateUserAccessTokenMw,
  middlewares.auth.common.validateUserAccessMw,
  middlewares.users.read.getUserMw,
  middlewares.users.response.returnUserMw
);

// PATCH /users/:id
router.patch(
  '/:id',
  middlewares.auth.common.validateUserAccessTokenMw,
  middlewares.auth.common.validateUserAccessMw,
  middlewares.users.common.validateUpdateUserPayloadMw,
  middlewares.users.read.getUserMw,
  middlewares.users.update.updateUserMw,
  middlewares.users.response.returnUserMw
);

// DELETE /users/:id
router.delete(
  '/:id',
  middlewares.auth.common.validateUserAccessTokenMw,
  middlewares.auth.common.validateUserAccessMw,
  middlewares.users.read.getUserMw,
  middlewares.users.delete.deleteUserMw
);

// POST /users/:id/delete
router.post(
  '/:id/delete',
  middlewares.auth.common.validateUserAccessTokenMw,
  middlewares.auth.common.validateUserAccessMw,
  middlewares.users.common.validateDeleteUserPayloadMw,
  middlewares.users.read.getUserMw,
  middlewares.auth.read.comparePasswordMw,
  middlewares.users.delete.deleteUserMw
);

export default router;
