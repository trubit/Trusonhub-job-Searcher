import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { isProd } from '../../../config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export class AuthController {
  private authService = new AuthService();

  private getDeviceInfo(req: Request) {
    return {
      ip: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown',
      device: req.headers['user-agent']?.includes('Mobile') ? 'Mobile Device' : 'Desktop Device',
      browser: 'Web Browser',
      os: 'Operating System',
    };
  }

  registerJobSeeker = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deviceInfo = this.getDeviceInfo(req);
      const { auth, refreshToken } = await this.authService.registerJobSeeker(req.body, deviceInfo);

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.status(201).json({
        success: true,
        message: 'Job Seeker registered successfully. Verification email sent.',
        data: auth,
      });
    } catch (error) {
      next(error);
    }
  };

  registerEmployer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deviceInfo = this.getDeviceInfo(req);
      const { auth, refreshToken } = await this.authService.registerEmployer(req.body, deviceInfo);

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.status(201).json({
        success: true,
        message: 'Employer registered successfully. Verification email sent.',
        data: auth,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deviceInfo = this.getDeviceInfo(req);
      const { emailOrUsername, password } = req.body;
      const { auth, refreshToken } = await this.authService.login(emailOrUsername, password, deviceInfo);

      res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
      res.status(200).json({
        success: true,
        message: 'Authentication successful',
        data: auth,
      });
    } catch (error) {
      next(error);
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rawRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      const deviceInfo = this.getDeviceInfo(req);
      const { auth, refreshToken: newRefreshToken } = await this.authService.refreshToken(rawRefreshToken, deviceInfo);

      res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: auth,
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const rawRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      const userId = req.user!._id.toString();
      const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
      const userAgent = req.headers['user-agent'] || 'Unknown';

      await this.authService.logout(rawRefreshToken, userId, ip, userAgent);

      res.clearCookie('refreshToken', { httpOnly: true, secure: isProd, sameSite: 'lax' });
      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const user = await this.authService.getCurrentUser(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.verifyEmail(req.body.token);
      res.status(200).json({
        success: true,
        message: 'Email address verified successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  resendVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.resendVerificationEmail(req.body.email);
      res.status(200).json({
        success: true,
        message: 'If the email exists and is unverified, a verification link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.forgotPassword(req.body.email);
      res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      res.status(200).json({
        success: true,
        message: 'Password reset successful. You may now log in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password updated successfully. Other active sessions have been invalidated.',
      });
    } catch (error) {
      next(error);
    }
  };

  getSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const currentRefreshToken = req.cookies?.refreshToken;
      const sessions = await this.authService.getActiveSessions(userId, currentRefreshToken);

      res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      next(error);
    }
  };

  revokeSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      const { id } = req.params;
      await this.authService.revokeSession(id, userId);

      res.status(200).json({
        success: true,
        message: 'Session revoked successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  logoutAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id.toString();
      await this.authService.logoutAll(userId);

      res.clearCookie('refreshToken', { httpOnly: true, secure: isProd, sameSite: 'lax' });
      res.status(200).json({
        success: true,
        message: 'Logged out from all devices',
      });
    } catch (error) {
      next(error);
    }
  };
}
