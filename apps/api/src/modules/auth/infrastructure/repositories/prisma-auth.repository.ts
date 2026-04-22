import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/prisma/prisma.service';

@Injectable()
export class PrismaAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: { email: string; passwordHash: string; displayName: string | null }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        displayName: data.displayName,
        provider: 'LOCAL',
      },
    });
  }

  async upsertGoogleUser(data: { googleId: string; email: string; displayName: string | null; avatarUrl: string | null }) {
    return this.prisma.user.upsert({
      where: { email: data.email },
      update: {
        googleId: data.googleId,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        provider: 'GOOGLE',
      },
      create: {
        email: data.email,
        googleId: data.googleId,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        provider: 'GOOGLE',
      },
    });
  }

  async updateRefreshToken(userId: string, hashedToken: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hashedToken },
    });
  }

  async clearRefreshToken(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
