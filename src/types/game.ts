export type Player = "player1" | "player2";

export interface SorryEvent {
  id: string;
  player: Player;
  timestamp: string;
}

export interface GameRound {
  id: string;
  sorryLimit: number;
  pledge: string;
  player1Count: number;
  player2Count: number;
  events: SorryEvent[];
  startedAt: string;
  endedAt: string | null;
  loser: Player | null;
  isActive: boolean;
}

export interface GameState {
  currentRound: GameRound | null;
  history: GameRound[];
}

