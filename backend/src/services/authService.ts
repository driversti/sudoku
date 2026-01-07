import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface RegisterResult {
  success: boolean;
  error?: string;
  userId?: string;
  username?: string;
}

export interface LoginResult {
  success: boolean;
  error?: string;
  userId?: string;
  username?: string;
}

/**
 * Register a new user
 */
export async function registerUser(username: string, password: string): Promise<RegisterResult> {
  try {
    // Check if username already exists
    const existingUser = await prisma.player.findUnique({
      where: { username },
    });

    if (existingUser) {
      return { success: false, error: 'Username already taken' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.player.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      userId: user.id,
      username: user.username,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Failed to register user' };
  }
}

/**
 * Login user
 */
export async function loginUser(username: string, password: string): Promise<LoginResult> {
  try {
    // Find user
    const user = await prisma.player.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password || '');

    if (!isValidPassword) {
      return { success: false, error: 'Invalid username or password' };
    }

    return {
      success: true,
      userId: user.id,
      username: user.username,
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Failed to login' };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  try {
    const user = await prisma.player.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}
