import { Router } from 'express';
import * as tipController from '../controllers/tip.controller.js';
import { requireAdmin, requireUserOrAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { tipCreateSchema, tipUpdateSchema } from '../validators/tip.schema.js';

const router = Router();

router.get('/', requireUserOrAdmin, tipController.list);
router.get('/:id', requireUserOrAdmin, tipController.find);
router.post('/', requireAdmin, validate(tipCreateSchema), tipController.create);
router.patch('/:id', requireAdmin, validate(tipUpdateSchema), tipController.update);
router.delete('/:id', requireAdmin, tipController.remove);

export default router;
