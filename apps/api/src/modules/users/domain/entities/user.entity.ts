export enum UserAuthProvider {
  Local = 'LOCAL',
  Google = 'GOOGLE',
}

export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly provider: UserAuthProvider,
    public readonly displayName: string | null,
    public readonly avatarUrl: string | null,
  ) {}
}
