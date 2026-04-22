import {Router} from 'express';
import { register, login, googleAuth, googleAuthCallback } from '../controllers/auth.controller';

const router = Router()

router.post('/auth/signup', register )

router.post('/auth/signin', login )

router.get('/auth/google', googleAuth)

router.get('/auth/google/callback', googleAuthCallback)
export default router