import { Router } from 'express';
import { register, login, refresh, logout, me } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.js';
import { authenticate } from '../middleware/authenticate.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

// Публічні маршрути (з перевіркою введених даних)
router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);

// Захищені маршрути (потрібен токен, тому додаємо authenticate)
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;