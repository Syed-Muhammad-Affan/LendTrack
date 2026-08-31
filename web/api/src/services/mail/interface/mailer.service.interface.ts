export interface IMailerService {
  sendWelcomeEmail(email: string, name: string): Promise<void>;
  sendResetPasswordEmail(to: string, rawToken: string): Promise<void>;
}
