import { Injectable } from '@nestjs/common';
import { FavoriteEntity } from '../../domain/entities/favorite.entity';
import { FavoritesRepositoryPort } from '../../domain/ports/favorites-repository.port';
import { PrismaService } from '../../../../core/prisma/prisma.service';

@Injectable()
export class PrismaFavoritesRepository implements FavoritesRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async listByUser(userId: string): Promise<FavoriteEntity[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map(
      (favorite) => new FavoriteEntity(favorite.id, favorite.userId, favorite.videoId, favorite.createdAt),
    );
  }

  async create(userId: string, videoId: string): Promise<FavoriteEntity> {
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        videoId,
      },
    });

    return new FavoriteEntity(favorite.id, favorite.userId, favorite.videoId, favorite.createdAt);
  }

  async delete(userId: string, videoId: string): Promise<void> {
    await this.prisma.favorite.deleteMany({
      where: { userId, videoId },
    });
  }

  async exists(userId: string, videoId: string): Promise<boolean> {
    const count = await this.prisma.favorite.count({
      where: { userId, videoId },
    });
    return count > 0;
  }
}
