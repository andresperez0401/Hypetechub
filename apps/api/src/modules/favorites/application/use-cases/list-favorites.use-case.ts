import type { FavoritesRepositoryPort } from '../../domain/ports/favorites-repository.port';
import type { FavoriteOutput } from '../types';

/**
 * Pure application use case — no NestJS imports.
 * Wired via factory provider in FavoritesModule.
 */
export class ListFavoritesUseCase {
  constructor(private readonly favoritesRepository: FavoritesRepositoryPort) {}

  async execute(userId: string): Promise<FavoriteOutput[]> {
    const favorites = await this.favoritesRepository.listByUser(userId);

    return favorites.map((favorite) => ({
      id: favorite.id,
      userId: favorite.userId,
      videoId: favorite.videoId,
      createdAt: favorite.createdAt.toISOString(),
    }));
  }
}
