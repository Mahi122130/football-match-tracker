import { Request, Response } from 'express';
import { matchService } from '../services/MatchService';

export class MatchController {
  createMatch(req: Request, res: Response) {
    const { teamA, teamB } = req.body;
    
    if (!teamA || !teamB) {
      return res.status(400).json({ error: 'Both teams are required' });
    }

    const match = matchService.createMatch(teamA, teamB);
    res.json(match);
  }

  startMatch(req: Request, res: Response) {
    const { matchId } = req.params;
    
    const match = matchService.startMatch(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json(match);
  }

  addGoal(req: Request, res: Response) {
    const { matchId } = req.params;
    const { team, player } = req.body;
    
    if (!team || !player) {
      return res.status(400).json({ error: 'Team and player are required' });
    }

    const event = matchService.addGoal(matchId, team, player);
    if (!event) {
      return res.status(404).json({ error: 'Match not found or not ongoing' });
    }

    res.json(event);
  }

  addCard(req: Request, res: Response) {
    const { matchId } = req.params;
    const { team, player, cardType } = req.body;
    
    if (!team || !player || !cardType) {
      return res.status(400).json({ error: 'Team, player and cardType are required' });
    }

    const event = matchService.addCard(matchId, team, player, cardType);
    if (!event) {
      return res.status(404).json({ error: 'Match not found or not ongoing' });
    }

    res.json(event);
  }

  getMatches(req: Request, res: Response) {
    const matches = matchService.getMatches();
    res.json(matches);
  }

  getMatch(req: Request, res: Response) {
    const { matchId } = req.params;
    const match = matchService.getMatch(matchId);
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json(match);
  }
}

export const matchController = new MatchController();