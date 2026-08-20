import { Router } from 'express';
import { IAuthController } from '../controllers/interface/auth.controller.interface.js';
import { validate } from '../middleware/zod.middleware.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  tokenParamsSchema,
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
      validate({ body: registerSchema }),
      this.AuthController.register.bind(this.AuthController),
    );

    this.router.post(
      '/login',
      validate({ body: loginSchema }),
      this.AuthController.login.bind(this.AuthController),
    );

    this.router.post(
      '/forgot-password',
      forgotPasswordLimiter,
      validate({ body: forgotPasswordSchema }),
      this.AuthController.forgotPassword.bind(this.AuthController),
    );

    this.router.post(
      '/reset-password/:token',
      validate({ body: resetPasswordSchema, params: tokenParamsSchema }),
      this.AuthController.resetPassword.bind(this.AuthController),
    );
  }
}
