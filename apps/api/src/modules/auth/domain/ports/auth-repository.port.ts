import { AuthUserEntity } from '../entities/auth-user.entity';

export const AUTH_REPOSITORY_PORT = Symbol('AUTH_REPOSITORY_PORT');

export interface AuthRepositoryPort {
  findByEmail(email: string): Promise<AuthUserEntity | null>;
}
