import type { AuthOutput } from '../types';

export interface GoogleAuthDependencies {
  upsertGoogleUser: (data: { googleId: string; email: string; displayName: string | null; avatarUrl: string | null }) => Promise<{ id: string; email: string; displayName: string | null; avatarUrl: string | null }>;
  signAccessToken: (payload: { sub: string; email: string }) => string;
  signRefreshToken: (payload: { sub: string; email: string }) => string;
  updateRefreshToken: (userId: string, hashedToken: string) => Promise<void>;
  hashToken: (token: string) => Promise<string>;
}

export class GoogleAuthUseCase {
  private deps: GoogleAuthDependencies | null;

  constructor(deps?: GoogleAuthDependencies) {
    this.deps = deps ?? null;
  }

  async execute(googleProfile?: { googleId: string; email: string; displayName: string | null; avatarUrl: string | null }): Promise<AuthOutput> {
    if (!this.deps || !googleProfile) {
      return {
        status: 'scaffolded',
        message: 'Google OAuth flow is prepared for Passport integration.',
      };
    }

    const user = await this.deps.upsertGoogleUser(googleProfile);

    const accessToken = this.deps.signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = this.deps.signRefreshToken({ sub: user.id, email: user.email });

    const hashedRefresh = await this.deps.hashToken(refreshToken);
    await this.deps.updateRefreshToken(user.id, hashedRefresh);

    return {
      status: 'success',
      message: 'Google login successful.',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
