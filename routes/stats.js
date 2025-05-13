import { Router } from 'express';
import {
    getTeamsBySport,
    addTeam,
    updateTeam,
    deleteTeam
} from '../controllers/statsController.js';

const router = Router();

router.get('/:sportId', getTeamsBySport);
router.post('/', addTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

export default router;