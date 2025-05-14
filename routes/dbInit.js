import { Router } from 'express';
import { initDatabase } from '../controllers/dbInitController.js';

const router = Router();
router.post('/init-db', initDatabase);
export default router;
