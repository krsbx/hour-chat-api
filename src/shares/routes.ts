import { Router } from 'express';
import userComponentRoutes from '../components/users/routes';
import userLocationRoutes from '../components/user-locations/routes';
import chatRoutes from '../components/chats/routes';

const router = Router();

router.use('/auth', userComponentRoutes.auth);
router.use('/users', userComponentRoutes.users);
router.use('/user-locations', userLocationRoutes);
router.use('/chats', chatRoutes);

export default router;
