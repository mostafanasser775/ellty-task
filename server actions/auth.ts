'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { signToken } from '@/lib/jwt';

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: {
    id: string;
    username: string;
  };
}

export async function registerAction(
  username: string,
  password: string
): Promise<AuthResult> {
  try {
    if (!username || !password) {
      return { success: false, error: 'Username and password are required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return { success: false, error: 'Username already exists' };
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });

    // Create JWT token
    const token = signToken({
      userId: user.id,
      username: user.username,
    });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function loginAction(
  username: string,
  password: string
): Promise<AuthResult> {
  try {
    if (!username || !password) {
      return { success: false, error: 'Username and password are required' };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Create JWT token
    const token = signToken({
      userId: user.id,
      username: user.username,
    });

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return {
      success: true,
      user: {
        id: user.id,
        username: user.username,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

export async function getCurrentUser(): Promise<{
  id: string;
  username: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return null;
    }

    const { verifyToken } = await import('@/lib/jwt');
    const payload = verifyToken(token.value);

    if (!payload) {
      return null;
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
