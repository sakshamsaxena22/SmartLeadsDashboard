import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/apiResponse';
import { verifyToken } from '../utils/token';
import { generateAccessToken } from '../utils/token';
import { env } from '../config/env';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

export const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { auth, refreshToken } = await authService.register(req.body);
      res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
      sendSuccess({ res, data: auth, message: 'Registration successful', statusCode: 201 });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { auth, refreshToken } = await authService.login(req.body);
      res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
      sendSuccess({ res, data: auth, message: 'Login successful' });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) {
        res.status(401).json({ success: false, message: 'No refresh token provided.' });
        return;
      }

      const decoded = verifyToken(token);
      const accessToken = generateAccessToken({
        userId: decoded.userId,
        role: decoded.role,
      });

      sendSuccess({ res, data: { accessToken } });
    } catch (error) {
      res.clearCookie('refreshToken');
      next(error);
    }
  },

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.getMe((req.user as any)._id.toString());
      sendSuccess({
        res,
        data: {
          _id: (user._id as any).toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('refreshToken');
    sendSuccess({ res, data: null, message: 'Logged out successfully' });
  },
};
