import nodemailer, { Transporter } from 'nodemailer';
import { IMailerService } from './interface/mailer.service.interface.js';
import { config } from '../config/config.js';

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
}
