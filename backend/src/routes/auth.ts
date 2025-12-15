import express, { Router } from 'express';
import type { Response } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import { generateToken } from '../utils/jwt.js';
import type { TokenPayload } from '../utils/jwt.js';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password.js';
import { authMiddleware } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router: Router = express.Router();
const prisma = new PrismaClient();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Name, email, and password are required'
      });
      return;
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      res.status(400).json({
        error: 'Weak password',
        message: passwordValidation.message
      });
      return;
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(409).json({
        error: 'Email already registered',
        message: 'Please use a different email or try logging in'
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        bio: ''
      }
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Return user info and token (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
});

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Email and password are required'
      });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Return user info and token (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token (requires valid token)
 */
router.post('/refresh', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No user found in token'
      });
      return;
    }

    // Generate new token
    const newToken = generateToken({
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role
    });

    res.json({
      message: 'Token refreshed successfully',
      token: newToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'An error occurred while refreshing token'
    });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user info
 */
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No user found in token'
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        _count: {
          select: {
            reviews: true,
            favorites: true
          }
        }
      }
    });

    if (!user) {
      res.status(404).json({
        error: 'Not found',
        message: 'User not found'
      });
      return;
    }

    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      error: 'Failed to get user info',
      message: 'An error occurred'
    });
  }
});

export default router;
