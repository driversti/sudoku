import { apiClient } from './client';
import type { Difficulty, LeaderboardEntry, SubmitScoreRequest } from '@/types';

export interface LeaderboardResponse {
  difficulty: Difficulty;
  entries: LeaderboardEntry[];
}

export async function getLeaderboard(difficulty: Difficulty): Promise<LeaderboardResponse> {
  const response = await apiClient.get<LeaderboardResponse>(`/leaderboard/${difficulty}`);
  return response.data;
}

export async function submitScore(data: SubmitScoreRequest): Promise<void> {
  await apiClient.post('/leaderboard', data);
}

export async function getPlayerBestScores(): Promise<LeaderboardResponse[]> {
  const response = await apiClient.get<{ [key: string]: LeaderboardResponse }>('/leaderboard/player/me');
  return Object.values(response.data);
}
