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
 
router.get('/players', get_players);
router.get('/players/search', search);
router.get('/players/search/stats', search_stats);
router.post('/players', add_player);
router.put('/players/:id', update_player);
router.delete('/players/:id', del_player);
 
export default router;