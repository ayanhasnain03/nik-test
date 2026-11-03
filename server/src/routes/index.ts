import { Router } from 'express';
import adminAuthRoutes from './adminAuth.routes.js';
import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import foodTestRoutes from './foodTest.routes.js';
import investigationRoutes from './investigation.routes.js';
import journalRoutes from './journal.routes.js';
import profileRoutes from './profile.routes.js';
import tipRoutes from './tip.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'nik-server' });
});

router.use('/auth', authRoutes);
router.use('/admin/auth', adminAuthRoutes);
router.use('/users', userRoutes);
router.use('/my-profile', profileRoutes);
router.use('/investigations', investigationRoutes);
router.use('/food-tests', foodTestRoutes);
router.use('/journals', journalRoutes);
router.use('/tips', tipRoutes);
router.use('/categories', categoryRoutes);

export default router;
