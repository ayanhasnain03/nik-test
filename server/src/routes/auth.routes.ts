import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { requireUser } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  loginSchema,
  recoverAccountSchema,
  recoverPasswordSchema,
  registerSchema,
} from '../validators/auth.schema.js';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/register', validate(registerSchema), authController.register);
router.post('/logout', requireUser, authController.logout);
router.post('/recover-account', validate(recoverAccountSchema), authController.recoverAccount);
router.post(
  '/recover-account/password',
  validate(recoverPasswordSchema),
  authController.recoverPassword,
);

export default router;
