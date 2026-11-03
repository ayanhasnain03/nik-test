import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { requireUserOrAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', requireUserOrAdmin, categoryController.list);

export default router;
