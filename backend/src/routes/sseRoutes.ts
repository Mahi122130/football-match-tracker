import { Router, Request, Response } from 'express';
import { matchService } from '../services/MatchService';

const router = Router();

// SSE endpoint for match list updates
router.get('/matches-stream', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send initial matches data
  const matches = matchService.getMatches();
  res.write(`data: ${JSON.stringify({
    type: 'matches_update',
    data: matches
  })}\n\n`);

  // Add client to list clients
  matchService.addListClient(res, req);
});

// SSE endpoint for specific match updates
router.get('/matches/:matchId/stream', (req: Request, res: Response) => {
  const { matchId } = req.params;
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const match = matchService.getMatch(matchId);
  if (!match) {
    res.write(`data: ${JSON.stringify({
      type: 'error',
      data: 'Match not found'
    })}\n\n`);
    res.end();
    return;
  }

  // Send initial match data
  res.write(`data: ${JSON.stringify({
    type: 'match_data',
    data: match
  })}\n\n`);

  // Add client to match clients
  matchService.addMatchClient(matchId, res, req);
});

export default router;