import nodemailer, { Transporter } from 'nodemailer';
import { IMailerService } from './interface/mailer.service.interface.js';
import { config } from '../../config/config.js';
import { ILoanPopulated } from '../../interface/loan.populated.interface.js';

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

  private async send(
    to: string,
    subject: string,
    body: { text: string } | { html: string },
  ): Promise<void> {
    await this.transporter.sendMail({
      from: config.mail.user,
      to,
      subject,
      ...body,
    });
  }

  async sendWelcomeEmail(email: string, name: string): Promise<void> {
    await this.send(email, 'Welcome to LendTrack', {
      text: `Hello ${name}, welcome to our application`,
    });
  }

  async sendResetPasswordEmail(to: string, rawToken: string): Promise<void> {
    const resetUrl = `${config.app.url}/reset-password/${rawToken}`;

    await this.send(to, 'Reset Your Password', {
      html: `<p>You requested a password reset.</p>
      <p><a href="${resetUrl}">Click here to reset your password</a></p>
      <p>This link expires in ${config.resetToken.expiryMinutes} minutes.
      If you didn't request this, ignore this email.</p>`,
    });
  }

  async sendPreDueReminder(
    to: string,
    itemName: string,
    dueDate: Date,
  ): Promise<void> {
    await this.send(to, `Reminder: "${itemName}" is due back soon`, {
      text: `Just a reminder that "${itemName}" is due back by ${dueDate.toDateString()}.`,
    });
  }

  async sendOverdueReminder(
    to: string,
    itemName: string,
    dueDate: Date,
  ): Promise<void> {
    await this.send(
      to,
      `Overdue: "${itemName}" was due on ${dueDate.toDateString()}`,
      {
        text: `"${itemName}" was expected back on ${dueDate.toDateString()} and hasn't been marked returned yet.`,
      },
    );
  }

  async sendWeeklyDigest(to: string, loans: ILoanPopulated[]): Promise<void> {
    const loanLines = loans
      .map((loan) => {
        const label = loan.itemId?.name ?? loan.borrowedItemName ?? 'an item';
        return `- ${label}, due ${loan.expectedReturnAt.toDateString()}`;
      })
      .join('\n');

    await this.send(to, 'Your weekly lending summary', {
      text: `Here's what's currently out or overdue:\n\n${loanLines}`,
    });
  }
}
