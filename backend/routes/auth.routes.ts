import {Router} from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router()

router.post('/api/auth/signup', register )

router.post('/api/auth/signin', login )

export default router