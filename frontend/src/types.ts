export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  status: 'scheduled' | 'ongoing' | 'finished';
  events: MatchEvent[];
  startTime?: string;
  endTime?: string;
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'yellow_card' | 'red_card' | 'foul';
  team: 'A' | 'B';
  player: string;
  minute: number;
  description: string;
  timestamp: string;
}

export interface SSEMessage {
  type: string;
  data: any;
}