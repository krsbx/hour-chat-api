import { Router } from 'express';
import middlewares from '../middlewares';

const router = Router();

// POST /user-locations/:userId
router.post(
  '/:userId',
  middlewares.common.validateUserLocationPayloadMw,
  middlewares.create.createUserLocationMw,
  middlewares.response.returnUserLocationMw
);

// GET /user-locations
router.get(
  '/',
  middlewares.read.getUserLocationsMw,
  middlewares.response.returnUserLocationsMw
);

// GET /user-locationss/:userId
router.get(
  '/:userId',
  middlewares.read.getUserLocationMw,
  middlewares.response.returnUserLocationMw
);

// DELETE /user-locations/:userId
router.delete(
  '/:userId',
  middlewares.read.getUserLocationMw,
  middlewares.delete.deleteUserLocationMw
);

export default router;
