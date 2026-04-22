export interface LoginInput {
  email: string;
  password: string;
  turnstileToken?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  displayName?: string;
  turnstileToken?: string;
}

export interface AuthOutput {
  status: string;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
