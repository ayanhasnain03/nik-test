import { Router } from 'express';
import * as foodTestController from '../controllers/foodTest.controller.js';
import { requireAdmin, requireUserOrAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { foodTestListQuerySchema, foodTestUpdateSchema } from '../validators/foodTest.schema.js';

const router = Router();

router.get('/', requireAdmin, validate(foodTestListQuerySchema, 'query'), foodTestController.list);
router.get('/:id', requireUserOrAdmin, foodTestController.find);
router.patch(
  '/:id',
  requireUserOrAdmin,
  validate(foodTestUpdateSchema),
  foodTestController.update,
);
router.delete('/:id', requireUserOrAdmin, foodTestController.remove);

export default router;
