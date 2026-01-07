import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateDifficulty, validateDate } from '../utils/validation';
import type { AuthRequest, DailyChallengeRequest, DailyChallengeResponse } from '../types';

const router = Router();

/**
 * Generate a seed from date and difficulty
 * This ensures all players get the same puzzle on the same day
 */
function generateDailySeed(date: string, difficulty: string): string {
  const baseString = `${date}-${difficulty}`;
  let hash = 0;
  for (let i = 0; i < baseString.length; i++) {
    const char = baseString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * GET /api/daily/:date/:difficulty
 * Get daily challenge seed for a specific date and difficulty
 */
router.get('/:date/:difficulty', (req: AuthRequest, res) => {
  try {
    const { date, difficulty } = req.params;

    // Validate inputs
    if (!validateDate(date)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    if (!validateDifficulty(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty' });
    }

    // Generate seed
    const seed = generateDailySeed(date, difficulty);

    const response: DailyChallengeResponse = {
      date,
      difficulty: difficulty as any,
      seed,
      completed: false, // TODO: Check if user has completed this daily challenge
    };

    res.json(response);
  } catch (error) {
    console.error('Get daily challenge error:', error);
    res.status(500).json({ error: 'Failed to get daily challenge' });
  }
});

/**
 * POST /api/daily/complete
 * Submit daily challenge completion (requires authentication)
 * TODO: Implement daily challenge tracking in a separate table
 */
router.post('/complete', authMiddleware, (req: AuthRequest, res) => {
  try {
    const { date, difficulty, timeSeconds, moves } = req.body;

    // Validate inputs
    if (!validateDate(date)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    if (!validateDifficulty(difficulty)) {
      return res.status(400).json({ error: 'Invalid difficulty' });
    }

    // TODO: Store daily challenge completion in database
    // For now, just return success
    res.json({
      success: true,
      message: 'Daily challenge completion recorded',
    });
  } catch (error) {
    console.error('Submit daily challenge error:', error);
    res.status(500).json({ error: 'Failed to submit daily challenge' });
  }
});

export default router;
