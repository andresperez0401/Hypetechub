import { Module } from '@nestjs/common';
import { AddFavoriteUseCase } from './application/use-cases/add-favorite.use-case';
import { ListFavoritesUseCase } from './application/use-cases/list-favorites.use-case';
import { RemoveFavoriteUseCase } from './application/use-cases/remove-favorite.use-case';
import {
  FAVORITES_REPOSITORY_PORT,
  type FavoritesRepositoryPort,
} from './domain/ports/favorites-repository.port';
import { PrismaFavoritesRepository } from './infrastructure/repositories/prisma-favorites.repository';
import { FavoritesController } from './http/favorites.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FavoritesController],
  providers: [
    {
      provide: FAVORITES_REPOSITORY_PORT,
      useClass: PrismaFavoritesRepository,
    },
    {
      provide: ListFavoritesUseCase,
      useFactory: (repo: FavoritesRepositoryPort) => new ListFavoritesUseCase(repo),
      inject: [FAVORITES_REPOSITORY_PORT],
    },
    {
      provide: AddFavoriteUseCase,
      useFactory: (repo: FavoritesRepositoryPort) => new AddFavoriteUseCase(repo),
      inject: [FAVORITES_REPOSITORY_PORT],
    },
    {
      provide: RemoveFavoriteUseCase,
      useFactory: (repo: FavoritesRepositoryPort) => new RemoveFavoriteUseCase(repo),
      inject: [FAVORITES_REPOSITORY_PORT],
    },
  ],
})
export class FavoritesModule {}
