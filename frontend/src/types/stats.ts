import type { Difficulty } from './sudoku';

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  bestTimes: Record<Difficulty, number>;
  totalMoves: number;
  totalHints: number;
}

export interface Score {
  id: string;
  playerId?: string;
  username?: string;
  difficulty: Difficulty;
  timeSeconds: number;
  moves: number;
  hintsUsed: number;
  completedAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  timeSeconds: number;
  moves: number;
  hintsUsed: number;
  isCurrentUser?: boolean;
}

export interface DailyChallenge {
  date: string;
  difficulty: Difficulty;
  seed: string;
  completed: boolean;
  bestTime?: number;
}

export interface SubmitScoreRequest {
  difficulty: Difficulty;
  timeSeconds: number;
  moves: number;
  hintsUsed: number;
}
