import { Router } from 'express';
import { 
    top_scorers,
    top_assists,
    most_cards,
    team_standings,
    recent_matches
} from '../controllers/statsController.js';

const router = Router();
 
router.get('/top-scorers/:sportId', top_scorers);
router.get('/top-assists/:sportId', top_assists);
router.get('/most-cards/:sportId', most_cards);
router.get('/team-standings/:sportId', team_standings);
router.get('/recent-matches/:sportId', recent_matches);
 
export default router;