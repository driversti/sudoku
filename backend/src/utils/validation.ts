/**
 * Validation utilities for API requests
 */

export interface ValidationError {
  field: string;
  message: string;
}

export function validateUsername(username: string): ValidationError | null {
  if (!username || username.trim().length === 0) {
    return { field: 'username', message: 'Username is required' };
  }
  if (username.length < 3) {
    return { field: 'username', message: 'Username must be at least 3 characters' };
  }
  if (username.length > 20) {
    return { field: 'username', message: 'Username must be less than 20 characters' };
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { field: 'username', message: 'Username can only contain letters, numbers, hyphens, and underscores' };
  }
  return null;
}

export function validatePassword(password: string): ValidationError | null {
  if (!password || password.length === 0) {
    return { field: 'password', message: 'Password is required' };
  }
  if (password.length < 6) {
    return { field: 'password', message: 'Password must be at least 6 characters' };
  }
  return null;
}

export function validateDifficulty(difficulty: string): boolean {
  return ['EASY', 'MEDIUM', 'HARD', 'EXPERT'].includes(difficulty);
}

export function validateDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

export function validateScore(timeSeconds: number, moves: number): ValidationError | null {
  if (timeSeconds < 0) {
    return { field: 'timeSeconds', message: 'Time must be positive' };
  }
  if (moves < 0) {
    return { field: 'moves', message: 'Moves must be positive' };
  }
  if (timeSeconds > 86400) { // 24 hours
    return { field: 'timeSeconds', message: 'Time seems too long' };
  }
  return null;
}

export function formatErrors(errors: ValidationError[]): { field: string; message: string }[] {
  return errors.map((e) => ({ field: e.field, message: e.message }));
}
