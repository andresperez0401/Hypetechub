import { UserNotFoundError } from '../../domain/errors/user-not-found.error';
import type { UsersRepositoryPort } from '../../domain/ports/users-repository.port';
import type { UserProfileOutput } from '../types';

/**
 * Pure application use case — no NestJS imports.
 * Wired via factory provider in UsersModule.
 */
export class GetMyProfileUseCase {
  constructor(private readonly usersRepository: UsersRepositoryPort) {}

  async execute(userId: string): Promise<UserProfileOutput> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    return {
      id: user.id,
      email: user.email,
      provider: user.provider,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
    };
  }
}
