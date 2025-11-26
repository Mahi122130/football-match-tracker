import { Router } from 'express';
import { matchController } from '../controllers/MatchController';

const router = Router();

// Admin routes
router.post('/matches', matchController.createMatch);
router.post('/matches/:matchId/start', matchController.startMatch);
router.post('/matches/:matchId/goal', matchController.addGoal);
router.post('/matches/:matchId/card', matchController.addCard);

// Public routes
router.get('/matches', matchController.getMatches);
router.get('/matches/:matchId', matchController.getMatch);

export default router;