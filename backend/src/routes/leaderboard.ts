import { Router } from 'express';
import { getLeaderboard, submitScore, getPlayerBestScores } from '../services/leaderboardService';
import { authMiddleware, optionalAuth } from '../middleware/auth';
import { scoreSubmissionRateLimit } from '../middleware/rateLimit';
import { validateDifficulty, validateScore } from '../utils/validation';
import type { AuthRequest, SubmitScoreRequest, LeaderboardResponse } from '../types';

const router = Router();

/**
 * GET /api/leaderboard/:difficulty
 * Get leaderboard for a specific difficulty
 */
router.get('/:difficulty', async (req: AuthRequest, res) => {
  try {
    const { difficulty } = req.params;

    // Validate difficulty
    if (!validateDifficulty(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty' });
    }

    const limit = Math.min(parseInt(req.query.limit as string) || 100, 100);
    const entries = await getLeaderboard(difficulty as any, limit);

    const response: LeaderboardResponse = {
      difficulty: difficulty as any,
      entries: entries.map((entry) => ({
        ...entry,
        completedAt: entry.completedAt.toISOString(),
      })),
    };

    res.json(response);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

/**
 * POST /api/leaderboard
 * Submit a new score (requires authentication)
 */
router.post('/', authMiddleware, scoreSubmissionRateLimit, async (req: AuthRequest, res) => {
  try {
    const { difficulty, timeSeconds, moves, hintsUsed }: SubmitScoreRequest = req.body;

    // Validate difficulty
    if (!validateDifficulty(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty' });
    }

    // Validate score
    const scoreError = validateScore(timeSeconds, moves);
    if (scoreError) {
      return res.status(400).json({ error: scoreError.message });
    }

    // Submit score
    const result = await submitScore({
      playerId: req.userId!,
      difficulty: difficulty as any,
      timeSeconds,
      moves,
      hintsUsed: hintsUsed || 0,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.status(201).json({
      success: true,
      rank: result.rank,
    });
  } catch (error) {
    console.error('Submit score error:', error);
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

/**
 * GET /api/leaderboard/player/:playerId
 * Get player's best scores (requires authentication)
 */
router.get('/player/:playerId', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { playerId } = req.params;

    // Users can only access their own scores
    if (req.userId !== playerId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const scores = await getPlayerBestScores(playerId);
    res.json({ scores });
  } catch (error) {
    console.error('Get player scores error:', error);
    res.status(500).json({ error: 'Failed to get player scores' });
  }
});

export default router;
