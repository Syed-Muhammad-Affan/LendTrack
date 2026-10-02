export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'premium';
}