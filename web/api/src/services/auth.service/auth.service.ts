import { config } from '../../config/config.js';
import errors from '../../errors/index.js';
import { IMailerService } from '../../mail/interface/mailer.service.interface.js';
import { IUserRepository } from '../../repository/interface/user.repository.interface.js';
import { generateResetToken, hashToken } from '../../utils/token.js';
import { IAuthService } from './interface/auth.service.interface.js';
import { AuthResponse } from './interface/authResponse.interface.js';
import { IGenericResponse } from './interface/genericResponse.interface.js';
import { ILoginDTO } from './interface/loginDTO.interface.js';
import { IRegisterDTO } from './interface/registerDTO.interface.js';
import bcrypt from 'bcryptjs';

export class AuthService implements IAuthService {
  constructor(
    private readonly UserRepository: IUserRepository,
    private readonly MailerService: IMailerService,
  ) {}

  async register(data: IRegisterDTO): Promise<AuthResponse> {
    const user = await this.UserRepository.createUser(data);

    await this.MailerService.sendWelcomeEmail(user.email, user.name);

    const token = user.createJWT();

    return {
      user: {
        id: user._id.toString(),
        username: user.name,
        email: user.email,
      },
      token,
    };
  }

  async login(data: ILoginDTO): Promise<AuthResponse> {
    const { email, password } = data;

    const user = await this.UserRepository.getSingleUserByEmail(email);

    if (!user) {
      throw new errors.Unauthenticated('Invalid Credential');
    }

    const isPasswordCorrect = user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new errors.Unauthenticated('Invalid Credential');
    }

    const token = user.createJWT();

    return {
      user: {
        id: user._id.toString(),
        username: user.name,
        email: user.email,
      },
      token,
    };
  }

  async forgotPassword(email: string): Promise<IGenericResponse> {
    const user = await this.UserRepository.getSingleUserByEmail(email);

    const genericResponse: IGenericResponse = {
      message: 'If that email exists, a reset link has been sent.',
    };

    if (!user) {
      return genericResponse;
    }

    const { rawToken, tokenHash } = generateResetToken();
    const expiryMinutes = config.resetToken.expiryMinutes;

    user.resetPasswordExpires = new Date(
      Date.now() + expiryMinutes * 60 * 1000,
    );
    user.resetPasswordTokenHash = tokenHash;

    await user.save();

    try {
      await this.MailerService.sendResetPasswordEmail(user.email, rawToken);
    } catch (error) {
      console.error('Failed to send reset email:', error);
    }

    return genericResponse;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const tokenHash = hashToken(token);

    const user =
      await this.UserRepository.getSingleUserByResetPasswordToken(tokenHash);

    if (!user) {
      throw new errors.BadRequest('Token is invalid or token is expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await this.UserRepository.updateUserPasswordAndClearResetToken(
      user._id,
      hashedPassword,
    );
  }
}
