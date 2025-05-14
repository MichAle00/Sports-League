import { Router } from 'express';
import {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getStandings,
  getTopScorers,
  getRecentMatches,
} from '../controllers/sportsController.js';

const router = Router();

router.get('/matches', getAllMatches);
router.get('/matches/:id', getMatchById);
router.post('/matches', createMatch);
router.put('/matches/:id', updateMatch);
router.delete('/matches/:id', deleteMatch);
router.get('/teams', getAllTeams);
router.get('/teams/:id', getTeamById);
router.post('/teams', createTeam);
router.put('/teams/:id', updateTeam);
router.delete('/teams/:id', deleteTeam);
router.get('/standings', getStandings);
router.get('/top-scorers', getTopScorers);
router.get('/recent-matches', getRecentMatches);

export default router;
