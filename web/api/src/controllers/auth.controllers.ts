import { Request, Response } from 'express';
import { IAuthService } from '../services/auth.service/interface/auth.service.interface.js';
import { IAuthController } from './interface/auth.controller.interface.js';
import { registerSchema } from '../validators/auth.validator.js';
import { BadRequest } from '../errors/bad-request.js';
import { StatusCodes } from 'http-status-codes';

export class AuthController implements IAuthController {
  constructor(private readonly AuthService: IAuthService) {}

  async register(req: Request, res: Response): Promise<Response> {
    const data = await this.AuthService.register(req.body);

    return res.status(StatusCodes.CREATED).json(data);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const data = await this.AuthService.login(req.body);

    return res.status(StatusCodes.OK).json(data);
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const genericResponse = await this.AuthService.forgotPassword(email);

    return res.status(StatusCodes.OK).json(genericResponse);
  }
}
