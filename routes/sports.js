import { Router } from 'express';
import {
	getAllSports,
	addSport,
	updateSport,
	deleteSport
} from '../controllers/sportsController.js';

const router = Router();

router.get('/', getAllSports);
router.post('/', addSport);
router.put('/:id', updateSport);
router.delete('/:id', deleteSport);

export default router;
