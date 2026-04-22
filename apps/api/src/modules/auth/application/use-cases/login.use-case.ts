import type { AuthOutput, LoginInput } from '../types';

export interface AuthDependencies {
  findUserByEmail: (email: string) => Promise<{ id: string; email: string; passwordHash: string | null; provider: string; displayName: string | null; avatarUrl: string | null } | null>;
  comparePasswords: (plain: string, hashed: string) => Promise<boolean>;
  signAccessToken: (payload: { sub: string; email: string }) => string;
  signRefreshToken: (payload: { sub: string; email: string }) => string;
  updateRefreshToken: (userId: string, hashedToken: string) => Promise<void>;
  hashToken: (token: string) => Promise<string>;
}

export class LoginUseCase {
  private deps: AuthDependencies | null;

  constructor(deps?: AuthDependencies) {
    this.deps = deps ?? null;
  }

  async execute(input: LoginInput): Promise<AuthOutput> {
    if (!this.deps) {
      return {
        status: 'scaffolded',
        message: 'Login flow is prepared for JWT + Turnstile integration.',
      };
    }

    const user = await this.deps.findUserByEmail(input.email);
    if (!user || !user.passwordHash) {
      return { status: 'error', message: 'Invalid credentials.' };
    }

    const isPasswordValid = await this.deps.comparePasswords(input.password, user.passwordHash);
    if (!isPasswordValid) {
      return { status: 'error', message: 'Invalid credentials.' };
    }

    const accessToken = this.deps.signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = this.deps.signRefreshToken({ sub: user.id, email: user.email });

    const hashedRefresh = await this.deps.hashToken(refreshToken);
    await this.deps.updateRefreshToken(user.id, hashedRefresh);

    return {
      status: 'success',
      message: 'Login successful.',
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
