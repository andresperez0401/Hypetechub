import { Injectable } from '@nestjs/common';
import { UserAuthProvider, UserEntity } from '../../domain/entities/user.entity';
import { UsersRepositoryPort } from '../../domain/ports/users-repository.port';
import { PrismaService } from '../../../../core/prisma/prisma.service';

@Injectable()
export class PrismaUsersRepository implements UsersRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(userId: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return null;
    }

    return new UserEntity(
      user.id,
      user.email,
      user.provider as UserAuthProvider,
      user.displayName,
      user.avatarUrl,
    );
  }
}
