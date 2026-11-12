import z from 'zod';
import { Types } from 'mongoose';

// Rejects anything that is not a valid 24-char hex ObjectId, so odd
// strings or objects never reach a database query.
export const objectIdSchema = z
  .string()
  .refine((value) => Types.ObjectId.isValid(value) && /^[a-f\d]{24}$/i.test(value), {
    message: 'Invalid id',
  });

// Only http(s) links: blocks javascript:, data: and similar schemes.
export const httpUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => {
      try {
        const { protocol } = new URL(value);
        return protocol === 'http:' || protocol === 'https:';
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid http(s) URL' },
  );
