import { Router } from 'express';
import { IAuthController } from '../controllers/interface/auth.controller.interface.js';
import { validate } from '../middleware/zode.middleware.js';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';

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
      this.AuthController.register,
    );

    this.router.post(
      '/login',
      validate(loginSchema),
      this.AuthController.login,
    );
  }
}
