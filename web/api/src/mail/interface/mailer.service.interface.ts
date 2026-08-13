import { Transporter } from 'nodemailer';

export interface IMailerService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
}
