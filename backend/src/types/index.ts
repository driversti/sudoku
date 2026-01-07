import type { Difficulty } from '@prisma/client';
import type { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  username?: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    username: string;
  };
  error?: string;
}

export interface SubmitScoreRequest {
  difficulty: Difficulty;
  timeSeconds: number;
  moves: number;
  hintsUsed: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  timeSeconds: number;
  moves: number;
  hintsUsed: number;
  completedAt: string;
}

export interface LeaderboardResponse {
  difficulty: Difficulty;
  entries: LeaderboardEntry[];
}

export interface DailyChallengeRequest {
  date: string;
  difficulty: Difficulty;
}

export interface DailyChallengeResponse {
  date: string;
  difficulty: Difficulty;
  seed: string;
  completed: boolean;
}
