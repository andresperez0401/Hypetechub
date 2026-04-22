import type { FavoritesRepositoryPort } from '../../domain/ports/favorites-repository.port';

export class RemoveFavoriteUseCase {
  constructor(private readonly favoritesRepo: FavoritesRepositoryPort) {}

  async execute(userId: string, videoId: string): Promise<void> {
    await this.favoritesRepo.delete(userId, videoId);
  }
}
