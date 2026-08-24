export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  token: string;
}
