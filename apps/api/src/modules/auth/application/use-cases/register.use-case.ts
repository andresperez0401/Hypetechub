import type { AuthOutput, RegisterInput } from '../types';

export interface RegisterDependencies {
  findUserByEmail: (email: string) => Promise<{ id: string } | null>;
  createUser: (data: { email: string; passwordHash: string; displayName: string | null }) => Promise<{ id: string; email: string; displayName: string | null; avatarUrl: string | null }>;
  hashPassword: (password: string) => Promise<string>;
  signAccessToken: (payload: { sub: string; email: string }) => string;
  signRefreshToken: (payload: { sub: string; email: string }) => string;
  updateRefreshToken: (userId: string, hashedToken: string) => Promise<void>;
  hashToken: (token: string) => Promise<string>;
}

export class RegisterUseCase {
  private deps: RegisterDependencies | null;

  constructor(deps?: RegisterDependencies) {
    this.deps = deps ?? null;
  }

  async execute(input: RegisterInput): Promise<AuthOutput> {
    if (!this.deps) {
      return {
        status: 'scaffolded',
        message: 'Register flow is prepared for bcrypt + JWT integration.',
      };
    }

    const existing = await this.deps.findUserByEmail(input.email);
    if (existing) {
      return { status: 'error', message: 'An account with this email already exists.' };
    }

    const passwordHash = await this.deps.hashPassword(input.password);
    const user = await this.deps.createUser({
      email: input.email,
      passwordHash,
      displayName: input.displayName ?? null,
    });

    const accessToken = this.deps.signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = this.deps.signRefreshToken({ sub: user.id, email: user.email });

    const hashedRefresh = await this.deps.hashToken(refreshToken);
    await this.deps.updateRefreshToken(user.id, hashedRefresh);

    return {
      status: 'success',
      message: 'Account created successfully.',
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
