import { AuthController } from '../controllers/auth.controller.js';
import { MailerService } from '../services/mail/mailer.service.js';
import { UserRepository } from '../repository/user.repository.js';
import { AuthRoute } from '../routes/auth.routes.js';
import { AuthService } from '../services/auth.service/auth.service.js';
import { JwtTokenService } from '../services/token.service/token.service.js';

export const createAuthModule = () => {
  const authService = new AuthService(
    new UserRepository(),
    new MailerService(),
    new JwtTokenService(),
  );

  return new AuthRoute(new AuthController(authService));
};
