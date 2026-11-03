import { Router } from 'express';
import * as adminAuthController from '../controllers/adminAuth.controller.js';
import { validate } from '../middleware/validate.js';
import { loginSchema } from '../validators/auth.schema.js';

const router = Router();

router.post('/login', validate(loginSchema), adminAuthController.login);
router.post('/logout', adminAuthController.logout);

export default router;
