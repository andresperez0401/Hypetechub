import { FavoriteEntity } from '../../../domain/entities/favorite.entity';
import type { FavoritesRepositoryPort } from '../../../domain/ports/favorites-repository.port';
import { ListFavoritesUseCase } from '../list-favorites.use-case';

describe('ListFavoritesUseCase', () => {
  let repo: jest.Mocked<FavoritesRepositoryPort>;
  let useCase: ListFavoritesUseCase;

  beforeEach(() => {
    repo = { listByUser: jest.fn(), create: jest.fn(), delete: jest.fn(), exists: jest.fn() };
    useCase = new ListFavoritesUseCase(repo);
  });

  it('returns mapped favorites for user', async () => {
    repo.listByUser.mockResolvedValue([
      new FavoriteEntity('id-1', 'user-1', 'yt-1', new Date('2026-01-01')),
      new FavoriteEntity('id-2', 'user-1', 'yt-2', new Date('2026-01-02')),
    ]);

    const result = await useCase.execute('user-1');

    expect(result).toHaveLength(2);
    expect(result[0].videoId).toBe('yt-1');
    expect(result[1].videoId).toBe('yt-2');
    expect(result[0].createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('returns empty array when user has no favorites', async () => {
    repo.listByUser.mockResolvedValue([]);

    const result = await useCase.execute('user-1');

    expect(result).toHaveLength(0);
  });
});
