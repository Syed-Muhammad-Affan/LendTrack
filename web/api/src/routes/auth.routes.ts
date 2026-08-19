import { Router } from 'express';
import { IAuthController } from '../controllers/interface/auth.controller.interface.js';
import { validate } from '../middleware/zod.middleware.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../validators/auth.validator.js';
import { forgotPasswordLimiter } from '../middleware/forgotPasswordLimiter.middleware.js';

export class AuthRoute {
  public readonly router: Router;

  constructor(private readonly AuthController: IAuthController) {
    this.router = Router();

    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/register',
      validate(registerSchema),
      this.AuthController.register.bind(this.AuthController),
    );

    this.router.post(
      '/login',
      validate(loginSchema),
      this.AuthController.login.bind(this.AuthController),
    );

    this.router.post(
      '/forgot-password',
      forgotPasswordLimiter,
      validate(forgotPasswordSchema),
      this.AuthController.forgotPassword.bind(this.AuthController),
    );

    this.router.post(
      '/reset-password/:token',
      validate(resetPasswordSchema),
      this.AuthController.resetPassword.bind(this.AuthController),
    );
  }
}
