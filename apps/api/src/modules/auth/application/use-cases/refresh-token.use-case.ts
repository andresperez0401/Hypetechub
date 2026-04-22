import type { AuthOutput } from '../types';

export interface RefreshTokenDependencies {
  findUserById: (id: string) => Promise<{ id: string; email: string; refreshToken: string | null; displayName: string | null; avatarUrl: string | null } | null>;
  compareTokens: (plain: string, hashed: string) => Promise<boolean>;
  signAccessToken: (payload: { sub: string; email: string }) => string;
  signRefreshToken: (payload: { sub: string; email: string }) => string;
  updateRefreshToken: (userId: string, hashedToken: string) => Promise<void>;
  hashToken: (token: string) => Promise<string>;
}

export class RefreshTokenUseCase {
  private deps: RefreshTokenDependencies | null;

  constructor(deps?: RefreshTokenDependencies) {
    this.deps = deps ?? null;
  }

  async execute(userId?: string, currentRefreshToken?: string): Promise<AuthOutput> {
    if (!this.deps || !userId || !currentRefreshToken) {
      return {
        status: 'scaffolded',
        message: 'Refresh flow is prepared for token rotation.',
      };
    }

    const user = await this.deps.findUserById(userId);
    if (!user || !user.refreshToken) {
      return { status: 'error', message: 'Invalid refresh token.' };
    }

    const isValid = await this.deps.compareTokens(currentRefreshToken, user.refreshToken);
    if (!isValid) {
      return { status: 'error', message: 'Invalid refresh token.' };
    }

    const accessToken = this.deps.signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = this.deps.signRefreshToken({ sub: user.id, email: user.email });

    const hashedRefresh = await this.deps.hashToken(refreshToken);
    await this.deps.updateRefreshToken(user.id, hashedRefresh);

    return {
      status: 'success',
      message: 'Token refreshed.',
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
