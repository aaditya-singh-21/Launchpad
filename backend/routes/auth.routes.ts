import {Router} from 'express';
import { UserModel } from '../models/user.model';
import { authMiddleware } from '../middlewares/auth.middleware';
import { register, login } from '../controllers/auth.controller';

const router = Router()

router.post('/api/auth/signup', register )

router.post('/api/auth/signin', login )

export default router