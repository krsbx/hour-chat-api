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
  middlewares.users.read.getUsersMw,
  middlewares.users.response.returnUsersMw
);

// GET /users/:id
router.post(
  '/:id',
  middlewares.users.read.getUserMw,
  middlewares.users.response.returnUserMw
);

// PATCH /users/:id
router.patch(
  '/:id',
  middlewares.users.common.validateUpdateUserPayloadMw,
  middlewares.users.read.getUserMw,
  middlewares.users.update.updateUserMw,
  middlewares.users.response.returnUserMw
);

// DELETE /users/:id
router.delete(
  '/:id',
  middlewares.users.read.getUserMw,
  middlewares.users.delete.deleteUserMw
);

export default router;
