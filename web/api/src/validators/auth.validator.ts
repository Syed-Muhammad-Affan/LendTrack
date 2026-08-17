import z from 'zod';

export const registerSchema = z.object({
  name: z.string().max(50).trim(),
  email: z.email(),
  password: z.string().min(6).max(24),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(24),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
