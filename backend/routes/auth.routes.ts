import {Router} from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router()

router.post('/auth/signup', register )

router.post('/auth/signin', login )

export default router