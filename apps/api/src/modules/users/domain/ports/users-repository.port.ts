import { UserEntity } from '../entities/user.entity';

export const USERS_REPOSITORY_PORT = Symbol('USERS_REPOSITORY_PORT');

export interface UsersRepositoryPort {
  findById(userId: string): Promise<UserEntity | null>;
}
