import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import * as investigationController from '../controllers/investigation.controller.js';
import * as foodTestController from '../controllers/foodTest.controller.js';
import * as journalController from '../controllers/journal.controller.js';
import { requireAdmin, requireUser, requireUserOrAdmin } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { registerSchema } from '../validators/auth.schema.js';
import { investigationCreateSchema } from '../validators/investigation.schema.js';
import { journalCreateSchema } from '../validators/journal.schema.js';
import { idParamSchema, userListQuerySchema, userUpdateSchema } from '../validators/user.schema.js';

const router = Router();

router.get('/', requireAdmin, validate(userListQuerySchema, 'query'), userController.list);
router.post('/', requireAdmin, validate(registerSchema), userController.create);
router.get('/:id', requireAdmin, validate(idParamSchema, 'params'), userController.find);
router.patch(
  '/:id',
  requireAdmin,
  validate(idParamSchema, 'params'),
  validate(userUpdateSchema),
  userController.update,
);
router.post(
  '/:id/upload-images',
  requireAdmin,
  validate(idParamSchema, 'params'),
  uploadImage,
  userController.uploadPhoto,
);
router.patch(
  '/:id/reset-password',
  requireAdmin,
  validate(idParamSchema, 'params'),
  userController.resetPassword,
);

router.get(
  '/:userId/investigations',
  requireUserOrAdmin,
  investigationController.listForUser,
);
router.post(
  '/:userId/investigations',
  requireUser,
  validate(investigationCreateSchema),
  investigationController.createForUser,
);

router.get('/:userId/food-tests', requireUserOrAdmin, foodTestController.listForUser);

router.get('/:userId/journals', requireUserOrAdmin, journalController.listForUser);
router.post(
  '/:userId/journals',
  requireUser,
  validate(journalCreateSchema),
  journalController.createForUser,
);

export default router;
