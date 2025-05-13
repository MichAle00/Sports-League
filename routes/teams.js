import { Router } from 'express';
import {
  get_team,
  spec_team,
  addTeam,
  upd_team,
  del_team,
} from '../controllers/teamsController.js';

const router = Router();

router.get('/', get_team);
router.get('/:id', spec_team);
router.post('/', addTeam);
router.put('/:id', upd_team);
router.delete('/:id', del_team);

export default router;
