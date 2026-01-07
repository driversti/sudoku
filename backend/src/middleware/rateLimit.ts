import type { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for general API requests
 */
export const generalRateLimit: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for authentication endpoints (stricter)
 */
export const authRateLimit: RequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: { error: 'Too many authentication attempts, please try again later' },
  skipSuccessfulRequests: true, // Don't count successful requests
});

/**
 * Rate limiter for score submission
 */
export const scoreSubmissionRateLimit: RequestHandler = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 score submissions per minute
  message: { error: 'Too many score submissions, please slow down' },
});
