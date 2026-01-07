import { PrismaClient } from '@prisma/client';
import type { Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

export interface LeaderboardEntry {
  rank: number;
  username: string;
  timeSeconds: number;
  moves: number;
  hintsUsed: number;
  completedAt: Date;
}

export interface SubmitScoreParams {
  playerId: string;
  difficulty: Difficulty;
  timeSeconds: number;
  moves: number;
  hintsUsed: number;
}

/**
 * Get leaderboard for a specific difficulty
 */
export async function getLeaderboard(difficulty: Difficulty, limit: number = 100): Promise<LeaderboardEntry[]> {
  try {
    const scores = await prisma.score.findMany({
      where: { difficulty },
      orderBy: [
        { timeSeconds: 'asc' },
        { moves: 'asc' },
        { completedAt: 'asc' },
      ],
      take: limit,
      include: {
        player: {
          select: {
            username: true,
          },
        },
      },
    });

    return scores.map((score, index) => ({
      rank: index + 1,
      username: score.player.username,
      timeSeconds: score.timeSeconds,
      moves: score.moves,
      hintsUsed: score.hintsUsed,
      completedAt: score.completedAt,
    }));
  } catch (error) {
    console.error('Get leaderboard error:', error);
    return [];
  }
}

/**
 * Submit a new score
 */
export async function submitScore(params: SubmitScoreParams): Promise<{ success: boolean; rank?: number; error?: string }> {
  try {
    const score = await prisma.score.create({
      data: {
        playerId: params.playerId,
        difficulty: params.difficulty,
        timeSeconds: params.timeSeconds,
        moves: params.moves,
        hintsUsed: params.hintsUsed,
      },
    });

    // Calculate rank
    const rank = await prisma.score.count({
      where: {
        difficulty: params.difficulty,
        OR: [
          { timeSeconds: { lt: params.timeSeconds } },
          {
            timeSeconds: params.timeSeconds,
            moves: { lt: params.moves },
          },
        ],
      },
    });

    return { success: true, rank: rank + 1 };
  } catch (error) {
    console.error('Submit score error:', error);
    return { success: false, error: 'Failed to submit score' };
  }
}

/**
 * Get player's best scores for each difficulty
 */
export async function getPlayerBestScores(playerId: string) {
  try {
    const scores = await prisma.score.findMany({
      where: { playerId },
      orderBy: [
        { timeSeconds: 'asc' },
        { moves: 'asc' },
      ],
      distinct: ['difficulty'],
    });

    return scores;
  } catch (error) {
    console.error('Get player scores error:', error);
    return [];
  }
}
