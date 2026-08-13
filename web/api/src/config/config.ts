import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),

  MONGO_URI: z.string().min(1),

  JWT_SECRET: z.string().min(32),

  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.coerce.number().positive(),
  MAIL_USER: z.string().min(1),
  MAIL_PASSWORD: z.string().min(1),
});

const env = envSchema.parse(process.env);

export const config = {
  server: {
    port: env.PORT,
  },

  database: {
    mongoUri: env.MONGO_URI,
  },

  jwt: {
    secret: env.JWT_SECRET,
    lifetime: '30d' as const,
  },

  mail: {
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    user: env.MAIL_USER,
    password: env.MAIL_PASSWORD,
  },
};
