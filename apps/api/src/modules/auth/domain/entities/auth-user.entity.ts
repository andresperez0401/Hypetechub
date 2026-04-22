export enum AuthProvider {
  Local = 'LOCAL',
  Google = 'GOOGLE',
}

export class AuthUserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly provider: AuthProvider,
    public readonly passwordHash: string | null,
  ) {}
}
