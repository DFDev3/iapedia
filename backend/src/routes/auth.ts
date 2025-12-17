import express, { Router } from 'express';
import type { Response } from 'express';
import { PrismaClient } from '../generated/prisma/client.js';
import { generateToken } from '../utils/jwt.js';
import type { TokenPayload } from '../utils/jwt.js';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password.js';
import { authMiddleware } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';
import { generateResetToken, getResetTokenExpiry, isTokenExpired } from '../utils/resetToken.js';
import { sendPasswordResetEmail } from '../services/email.js';

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

    // Create user with default placeholder avatar
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
        avatarUrl: '/avatars/default-avatar.png',
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

/**
 * POST /api/auth/forgot-password
 * Request password reset email
 */
router.post('/forgot-password', async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        error: 'Validación fallida',
        message: 'El correo electrónico es requerido'
      });
      return;
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Always return success to prevent email enumeration
    if (!user) {
      res.json({
        message: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña'
      });
      return;
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpiry = getResetTokenExpiry();

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    });

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, user.name, resetToken);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Clear the token if email fails
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken: null,
          resetTokenExpiry: null
        }
      });
      res.status(500).json({
        error: 'Servicio de correo no disponible',
        message: 'Error al enviar el correo de restablecimiento. Por favor intenta más tarde.'
      });
      return;
    }

    res.json({
      message: 'Si existe una cuenta con este correo, se ha enviado un enlace para restablecer la contraseña'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      error: 'Restablecimiento de contraseña fallido',
      message: 'Ocurrió un error'
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password using token
 */
router.post('/reset-password', async (req: AuthRequest, res: Response) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        error: 'Validación fallida',
        message: 'El token y la nueva contraseña son requeridos'
      });
      return;
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      res.status(400).json({
        error: 'Contraseña débil',
        message: passwordValidation.message
      });
      return;
    }

    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: { resetToken: token }
    });

    if (!user) {
      res.status(400).json({
        error: 'Token inválido',
        message: 'El token de restablecimiento de contraseña es inválido'
      });
      return;
    }

    // Check if token is expired
    if (isTokenExpired(user.resetTokenExpiry)) {
      res.status(400).json({
        error: 'Token expirado',
        message: 'El token de restablecimiento ha expirado. Por favor solicita uno nuevo.'
      });
      return;
    }

    // Hash new password
    const hashedPassword = await hashPassword(password);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    res.json({
      message: 'Contraseña restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      error: 'Restablecimiento de contraseña fallido',
      message: 'Ocurrió un error'
    });
  }
});

export default router;
