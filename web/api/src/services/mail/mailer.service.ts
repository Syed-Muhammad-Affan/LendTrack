import nodemailer, { Transporter } from 'nodemailer';
import { IMailerService } from './interface/mailer.service.interface.js';
import { config } from '../../config/config.js';

export class MailerService implements IMailerService {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: true,
      auth: {
        user: config.mail.user,
        pass: config.mail.password,
      },
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.transporter.sendMail({
      from: config.mail.user,
      to: email,
      subject: 'Welcome to LendTrack',
      text: `Hello ${name}, welcome to our application`,
    });
  }

  async sendResetPasswordEmail(to: string, rawToken: string): Promise<void> {
    const resetUrl = `${config.app.url}/reset-password/${rawToken}`;

    await this.transporter.sendMail({
      from: config.mail.user,
      to: to,
      subject: 'Reset Your Password',
      html: `<p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in ${process.env.RESET_TOKEN_EXPIRY_MINUTES} minutes.
      If you didn't request this, ignore this email.</p>`,
    });
  }
}
