export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    plan: string;
    premiumExpiresAt: Date;
    preferences: {
      emailReminder: boolean;
      weeklyDigest: boolean;
    };
  };
  token: string;
}
