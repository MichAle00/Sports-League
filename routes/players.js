import { Router } from 'express';
import { 
    get_players,
    search,
    search_stats,
    add_player,
    update_player,
    del_player,
} from '../controllers/playerController.js';

const router = Router();
 
router.get('/', get_players);
router.get('/search', search);
router.get('/search/stats/:id', search_stats);
router.post('/', add_player);
router.put('/:id', update_player);
router.delete('/:id', del_player);
 
export default router;