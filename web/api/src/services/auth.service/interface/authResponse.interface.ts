export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    plan: 'free' | 'premium';
    premiumExpiresAt: Date;
    preferences: {
      emailReminder: boolean;
      weeklyDigest: boolean;
    };
  };
  token: string;
}
