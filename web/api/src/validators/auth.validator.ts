import z, { email } from 'zod';

export const registerSchema = z.object({
  name: z.string().max(50).trim(),
  email: z.email(),
  password: z.string().min(8).max(24),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(24),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).max(24),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
