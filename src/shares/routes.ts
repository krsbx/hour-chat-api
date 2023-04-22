import { Router } from 'express';
import userComponentRoutes from '../components/users/routes';

const router = Router();

router.use('/auth', userComponentRoutes.auth);
router.use('/users', userComponentRoutes.users);

export default router;
