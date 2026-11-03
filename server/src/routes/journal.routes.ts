import { Router } from 'express';
import * as journalController from '../controllers/journal.controller.js';
import { requireUser, requireUserOrAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { journalUpdateSchema } from '../validators/journal.schema.js';

const router = Router();

router.get('/:id', requireUserOrAdmin, journalController.find);
router.patch('/:id', requireUser, validate(journalUpdateSchema), journalController.update);

export default router;
