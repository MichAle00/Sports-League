import { Router } from 'express';
import { 
    top_scorers,
    top_assists,
    most_cards,
    team_standings,
    recent_matches
} from '../controllers/statsController.js';

const router = Router();
 
router.get('/top-scorers', top_scorers);
router.get('/top-assists', top_assists);
router.get('/most-cards', most_cards);
router.get('/team-standings', team_standings);
router.get('/recent-matches', recent_matches);
 
export default router;