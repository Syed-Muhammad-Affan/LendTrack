import { AuthController } from '../controllers/auth.controllers.js';
import { MailerService } from '../mail/mailer.service.js';
import { UserRepository } from '../repository/user.repository.js';
import { AuthRoute } from '../routes/auth.routes.js';
import { AuthService } from '../services/auth.service/auth.service.js';

export const createAuthModule = () => {
  const userRepository = new UserRepository();
  const mailer = new MailerService();

  const authService = new AuthService(userRepository, mailer);

  const authController = new AuthController(authService);

  return new AuthRoute(authController);
};
