import { Router } from 'express';
import userComponentRoutes from '../components/users/routes';
import userLocationRoutes from '../components/user-locations/routes';
import chatRoutes from '../components/chats/routes';
import emailOtpRoutes from '../components/email-otps/routes';
import deviceTokenRoutes from '../components/device-tokens/routes';

const router = Router();

router.use('/auth', userComponentRoutes.auth);
router.use('/users', userComponentRoutes.users);
router.use('/user-locations', userLocationRoutes);
router.use('/chats', chatRoutes);
router.use('/device-tokens', deviceTokenRoutes);
router.use('/email-otps', emailOtpRoutes);

export default router;
