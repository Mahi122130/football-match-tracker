import { Match, MatchEvent } from '../types';
import { Request, Response } from 'express';

export class MatchService {
  private matches: Map<string, Match> = new Map();
  private clients: Map<string, Response[]> = new Map();
  private listClients: Response[] = [];

  createMatch(teamA: string, teamB: string): Match {
    const match: Match = {
      id: Math.random().toString(36).substr(2, 9),
      teamA,
      teamB,
      scoreA: 0,
      scoreB: 0,
      status: 'scheduled',
      events: []
    };
    
    this.matches.set(match.id, match);
    this.clients.set(match.id, []);
    
    console.log(`Match created: ${teamA} vs ${teamB} (ID: ${match.id})`);
    return match;
  }

  startMatch(matchId: string): Match | null {
    const match = this.matches.get(matchId);
    if (!match) return null;

    match.status = 'ongoing';
    match.startTime = new Date();
    
    this.broadcastToMatchList();
    this.broadcastToMatch(matchId, {
      type: 'match_started',
      data: this.serializeMatch(match)
    });
    
    return match;
  }

  addGoal(matchId: string, team: 'A' | 'B', player: string): MatchEvent | null {
    const match = this.matches.get(matchId);
    if (!match || match.status !== 'ongoing') return null;

    if (team === 'A') match.scoreA++;
    else match.scoreB++;

    const event: MatchEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'goal',
      team,
      player,
      minute: this.getCurrentMinute(match.startTime!),
      description: `Goal by ${player}`,
      timestamp: new Date()
    };

    match.events.push(event);

    this.broadcastToMatch(matchId, {
      type: 'goal',
      data: this.serializeEvent(event)
    });

    this.broadcastToMatchList();

    return event;
  }

  addCard(matchId: string, team: 'A' | 'B', player: string, cardType: 'yellow_card' | 'red_card'): MatchEvent | null {
    const match = this.matches.get(matchId);
    if (!match || match.status !== 'ongoing') return null;

    const event: MatchEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: cardType,
      team,
      player,
      minute: this.getCurrentMinute(match.startTime!),
      description: `${cardType === 'yellow_card' ? 'Yellow' : 'Red'} card for ${player}`,
      timestamp: new Date()
    };

    match.events.push(event);

    this.broadcastToMatch(matchId, {
      type: cardType,
      data: this.serializeEvent(event)
    });

    return event;
  }

  getMatches(): Match[] {
    return Array.from(this.matches.values()).map(match => this.serializeMatch(match));
  }

  getMatch(matchId: string): Match | null {
    const match = this.matches.get(matchId);
    return match ? this.serializeMatch(match) : null;
  }

  // SSE Methods
  addMatchClient(matchId: string, res: Response, req: Request) {
    const clients = this.clients.get(matchId) || [];
    clients.push(res);
    this.clients.set(matchId, clients);

    req.on('close', () => {
      const currentClients = this.clients.get(matchId) || [];
      this.clients.set(matchId, currentClients.filter(client => client !== res));
      console.log(`Client disconnected from match ${matchId}`);
    });
  }

  addListClient(res: Response, req: Request) {
    this.listClients.push(res);
    
    req.on('close', () => {
      this.listClients = this.listClients.filter(client => client !== res);
      console.log('Client disconnected from match list');
    });
  }

  private broadcastToMatch(matchId: string, message: any) {
    const clients = this.clients.get(matchId) || [];
    clients.forEach(client => {
      try {
        client.write(`data: ${JSON.stringify(message)}\n\n`);
      } catch (error) {
        console.log('Error writing to client, removing from list');
        const updatedClients = clients.filter(c => c !== client);
        this.clients.set(matchId, updatedClients);
      }
    });
  }

  private broadcastToMatchList() {
    const matches = this.getMatches();
    const message = {
      type: 'matches_update',
      data: matches
    };

    this.listClients.forEach(client => {
      try {
        client.write(`data: ${JSON.stringify(message)}\n\n`);
      } catch (error) {
        console.log('Error writing to list client, removing from list');
        this.listClients = this.listClients.filter(c => c !== client);
      }
    });
  }

  private getCurrentMinute(startTime: Date): number {
    return Math.floor((new Date().getTime() - startTime.getTime()) / (1000 * 60));
  }

  // Helper methods to serialize Date objects to strings for JSON
  private serializeMatch(match: Match): any {
    return {
      ...match,
      startTime: match.startTime ? match.startTime.toISOString() : undefined,
      endTime: match.endTime ? match.endTime.toISOString() : undefined,
      events: match.events.map(event => this.serializeEvent(event))
    };
  }

  private serializeEvent(event: MatchEvent): any {
    return {
      ...event,
      timestamp: event.timestamp.toISOString()
    };
  }
}

export const matchService = new MatchService();