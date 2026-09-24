import { Request, Response } from 'express';
import { IAuthService } from '../services/auth.service/interface/auth.service.interface.js';
import { IAuthController } from './interface/auth.controller.interface.js';
import { BadRequest } from '../errors/bad-request.js';
import { StatusCodes } from 'http-status-codes';

export class AuthController implements IAuthController {
  constructor(private readonly AuthService: IAuthService) {}

  async register(req: Request, res: Response): Promise<Response> {
    const data = await this.AuthService.register(req.body);

    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, match your JWT expiry
      path: '/',
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User register successfully',
      data: data.user,
    });
  }

  async login(req: Request, res: Response): Promise<Response> {
    const data = await this.AuthService.login(req.body);

    res.cookie('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, match your JWT expiry
      path: '/',
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'User login successfully',
      data: data.user,
    });
  }

  async logout(req: Request, res: Response): Promise<Response> {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logged out successfully',
      data: null,
    });
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const genericResponse = await this.AuthService.forgotPassword(email);

    return res.status(StatusCodes.OK).json(genericResponse);
  }

  async resetPassword(req: Request, res: Response): Promise<Response> {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (typeof token !== 'string' || typeof newPassword !== 'string') {
      throw new BadRequest('Reset token and new password is required');
    }

    await this.AuthService.resetPassword(token, newPassword);

    return res
      .status(StatusCodes.OK)
      .json({ message: 'Password has been reset' });
  }
}
