import { Module } from '@nestjs/common';
import { GetMyProfileUseCase } from './application/use-cases/get-my-profile.use-case';
import {
  USERS_REPOSITORY_PORT,
  type UsersRepositoryPort,
} from './domain/ports/users-repository.port';
import { PrismaUsersRepository } from './infrastructure/repositories/prisma-users.repository';
import { UsersController } from './http/users.controller';

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: USERS_REPOSITORY_PORT,
      useClass: PrismaUsersRepository,
    },
    {
      provide: GetMyProfileUseCase,
      useFactory: (repo: UsersRepositoryPort) => new GetMyProfileUseCase(repo),
      inject: [USERS_REPOSITORY_PORT],
    },
  ],
})
export class UsersModule {}
