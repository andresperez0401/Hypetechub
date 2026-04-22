import { FavoriteEntity } from '../../../domain/entities/favorite.entity';
import { FavoriteAlreadyExistsError } from '../../../domain/errors/favorite-already-exists.error';
import type { FavoritesRepositoryPort } from '../../../domain/ports/favorites-repository.port';
import { AddFavoriteUseCase } from '../add-favorite.use-case';

const makeEntity = (videoId: string): FavoriteEntity =>
  new FavoriteEntity('fav-id', 'user-1', videoId, new Date('2026-01-01'));

describe('AddFavoriteUseCase', () => {
  let repo: jest.Mocked<FavoritesRepositoryPort>;
  let useCase: AddFavoriteUseCase;

  beforeEach(() => {
    repo = { listByUser: jest.fn(), create: jest.fn(), delete: jest.fn(), exists: jest.fn() };
    useCase = new AddFavoriteUseCase(repo);
  });

  it('adds favorite and returns output', async () => {
    repo.listByUser.mockResolvedValue([]);
    repo.create.mockResolvedValue(makeEntity('yt-1'));

    const result = await useCase.execute('user-1', { videoId: 'yt-1' });

    expect(repo.create).toHaveBeenCalledWith('user-1', 'yt-1');
    expect(result.videoId).toBe('yt-1');
    expect(result.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  it('throws FavoriteAlreadyExistsError when duplicate', async () => {
    repo.listByUser.mockResolvedValue([makeEntity('yt-1')]);

    await expect(useCase.execute('user-1', { videoId: 'yt-1' })).rejects.toThrow(
      FavoriteAlreadyExistsError,
    );
    expect(repo.create).not.toHaveBeenCalled();
  });
});
