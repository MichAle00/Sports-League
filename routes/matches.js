import { Router } from 'express';
import { 
    getAllMatches,
    getMatchById,
    createMatch,
    updateMatch,
    deleteMatch,
    searchMatches,
} from '../controllers/matchesController.js';

const router = Router();

router.get('/', getAllMatches);
router.get('/search', searchMatches);
router.get('/:id', getMatchById);
router.post('/', createMatch);
router.put('/:id', updateMatch);
router.delete('/:id', deleteMatch);
 
export default router;