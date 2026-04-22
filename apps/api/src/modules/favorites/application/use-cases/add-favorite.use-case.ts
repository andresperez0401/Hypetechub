import { FavoriteAlreadyExistsError } from '../../domain/errors/favorite-already-exists.error';
import type { FavoritesRepositoryPort } from '../../domain/ports/favorites-repository.port';
import type { AddFavoriteInput, FavoriteOutput } from '../types';

/**
 * Pure application use case — no NestJS imports.
 * Wired via factory provider in FavoritesModule.
 */
export class AddFavoriteUseCase {
  constructor(private readonly favoritesRepository: FavoritesRepositoryPort) {}

  async execute(userId: string, input: AddFavoriteInput): Promise<FavoriteOutput> {
    const existing = await this.favoritesRepository.listByUser(userId);

    if (existing.some((item) => item.videoId === input.videoId)) {
      throw new FavoriteAlreadyExistsError(userId, input.videoId);
    }

    const favorite = await this.favoritesRepository.create(userId, input.videoId);

    return {
      id: favorite.id,
      userId: favorite.userId,
      videoId: favorite.videoId,
      createdAt: favorite.createdAt.toISOString(),
    };
  }
}
