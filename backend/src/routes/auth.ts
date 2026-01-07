import { Router } from 'express';
import { registerUser, loginUser, getUserById } from '../services/authService';
import { generateToken } from '../middleware/auth';
import { authRateLimit } from '../middleware/rateLimit';
import { validateUsername, validatePassword, formatErrors } from '../utils/validation';
import type { AuthRequest, RegisterRequest, LoginRequest, AuthResponse } from '../types';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', authRateLimit, async (req: AuthRequest, res) => {
  try {
    const { username, password }: RegisterRequest = req.body;

    // Validate input
    const errors: NonNullable<ReturnType<typeof validateUsername>>[] = [];
    const usernameError = validateUsername(username);
    const passwordError = validatePassword(password);

    if (usernameError) errors.push(usernameError);
    if (passwordError) errors.push(passwordError);

    if (errors.length > 0) {
      return res.status(400).json({ errors: formatErrors(errors) });
    }

    // Register user
    const result = await registerUser(username, password);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Generate token
    const token = generateToken(result.userId!, result.username!);

    const response: AuthResponse = {
      success: true,
      token,
      user: {
        id: result.userId!,
        username: result.username!,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to register' });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', authRateLimit, async (req: AuthRequest, res) => {
  try {
    const { username, password }: LoginRequest = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Login user
    const result = await loginUser(username, password);

    if (!result.success) {
      return res.status(401).json({ error: result.error });
    }

    // Generate token
    const token = generateToken(result.userId!, result.username!);

    const response: AuthResponse = {
      success: true,
      token,
      user: {
        id: result.userId!,
        username: result.username!,
      },
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

/**
 * GET /api/auth/me
 * Get current user info
 */
router.get('/me', async (req: AuthRequest, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      const user = await getUserById(decoded.userId);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

export default router;
