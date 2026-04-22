import { FavoriteEntity } from '../entities/favorite.entity';

export const FAVORITES_REPOSITORY_PORT = Symbol('FAVORITES_REPOSITORY_PORT');

export interface FavoritesRepositoryPort {
  listByUser(userId: string): Promise<FavoriteEntity[]>;
  create(userId: string, videoId: string): Promise<FavoriteEntity>;
  delete(userId: string, videoId: string): Promise<void>;
  exists(userId: string, videoId: string): Promise<boolean>;
}
