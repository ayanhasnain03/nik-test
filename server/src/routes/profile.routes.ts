import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { requireUser, requireUserOrAdmin } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { profileUpdateSchema } from '../validators/user.schema.js';

const router = Router();

router.get('/', requireUserOrAdmin, userController.myProfile);
router.patch('/', requireUser, validate(profileUpdateSchema), userController.updateMyProfile);
router.post('/photos', requireUser, uploadImage, userController.uploadPhoto);

export default router;
