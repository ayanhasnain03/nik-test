import { Router } from 'express';
import * as investigationController from '../controllers/investigation.controller.js';
import { requireAdmin, requireUser, requireUserOrAdmin } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { foodTestCreateSchema } from '../validators/foodTest.schema.js';
import {
  activityCreateSchema,
  investigationCreateSchema,
  investigationListQuerySchema,
  investigationUpdateSchema,
} from '../validators/investigation.schema.js';

const router = Router();

router.get(
  '/',
  requireAdmin,
  validate(investigationListQuerySchema, 'query'),
  investigationController.listAll,
);
router.post(
  '/',
  requireUserOrAdmin,
  validate(investigationCreateSchema),
  investigationController.create,
);

router.get('/:id', requireUserOrAdmin, investigationController.find);
router.patch(
  '/:id',
  requireUserOrAdmin,
  validate(investigationUpdateSchema),
  investigationController.update,
);
router.delete('/:id', requireUserOrAdmin, investigationController.remove);
router.post('/:id/upload-images', requireUserOrAdmin, uploadImage, investigationController.uploadImage);

router.get('/:id/food-tests', requireUserOrAdmin, investigationController.listTests);
router.post(
  '/:id/food-tests',
  requireUser,
  validate(foodTestCreateSchema),
  investigationController.createTest,
);

router.get('/:id/activities', requireUserOrAdmin, investigationController.listActivities);
router.post(
  '/:id/activities',
  requireUserOrAdmin,
  validate(activityCreateSchema),
  investigationController.createActivity,
);

export default router;
