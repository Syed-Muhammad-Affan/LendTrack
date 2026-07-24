const JWT_SECRET = process.env.JWT_SECRET;
const JWT_LIFETIME = '30d' as const;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing');
}

export const config = {
  JWT_SECRET,
  JWT_LIFETIME,
};
