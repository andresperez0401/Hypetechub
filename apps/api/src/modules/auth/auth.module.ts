import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token.use-case';
import { GoogleAuthUseCase } from './application/use-cases/google-auth.use-case';
import { PrismaAuthRepository } from './infrastructure/repositories/prisma-auth.repository';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { GoogleStrategy } from './infrastructure/strategies/google.strategy';
import { AuthController } from './http/auth.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'dev-secret',
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaAuthRepository,
    JwtStrategy,
    GoogleStrategy,
    {
      provide: LoginUseCase,
      useFactory: (repo: PrismaAuthRepository, config: ConfigService) => {
        const jwtService = new JwtService({
          secret: config.get<string>('JWT_SECRET') ?? 'dev-secret',
          signOptions: { expiresIn: '15m' },
        });
        const refreshJwtService = new JwtService({
          secret: config.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret',
          signOptions: { expiresIn: '7d' },
        });

        return new LoginUseCase({
          findUserByEmail: (email: string) => repo.findUserByEmail(email),
          comparePasswords: (plain: string, hashed: string) => bcrypt.compare(plain, hashed),
          signAccessToken: (payload: { sub: string; email: string }) => jwtService.sign(payload),
          signRefreshToken: (payload: { sub: string; email: string }) => refreshJwtService.sign(payload),
          updateRefreshToken: (userId: string, hash: string) => repo.updateRefreshToken(userId, hash),
          hashToken: (token: string) => bcrypt.hash(token, 10),
        });
      },
      inject: [PrismaAuthRepository, ConfigService],
    },
    {
      provide: RegisterUseCase,
      useFactory: (repo: PrismaAuthRepository, config: ConfigService) => {
        const jwtService = new JwtService({
          secret: config.get<string>('JWT_SECRET') ?? 'dev-secret',
          signOptions: { expiresIn: '15m' },
        });
        const refreshJwtService = new JwtService({
          secret: config.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret',
          signOptions: { expiresIn: '7d' },
        });

        return new RegisterUseCase({
          findUserByEmail: (email: string) => repo.findUserByEmail(email),
          createUser: (data) => repo.createUser(data),
          hashPassword: (password: string) => bcrypt.hash(password, 12),
          signAccessToken: (payload: { sub: string; email: string }) => jwtService.sign(payload),
          signRefreshToken: (payload: { sub: string; email: string }) => refreshJwtService.sign(payload),
          updateRefreshToken: (userId: string, hash: string) => repo.updateRefreshToken(userId, hash),
          hashToken: (token: string) => bcrypt.hash(token, 10),
        });
      },
      inject: [PrismaAuthRepository, ConfigService],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (repo: PrismaAuthRepository, config: ConfigService) => {
        const jwtService = new JwtService({
          secret: config.get<string>('JWT_SECRET') ?? 'dev-secret',
          signOptions: { expiresIn: '15m' },
        });
        const refreshJwtService = new JwtService({
          secret: config.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret',
          signOptions: { expiresIn: '7d' },
        });

        return new RefreshTokenUseCase({
          findUserById: (id: string) => repo.findUserById(id),
          compareTokens: (plain: string, hashed: string) => bcrypt.compare(plain, hashed),
          signAccessToken: (payload: { sub: string; email: string }) => jwtService.sign(payload),
          signRefreshToken: (payload: { sub: string; email: string }) => refreshJwtService.sign(payload),
          updateRefreshToken: (userId: string, hash: string) => repo.updateRefreshToken(userId, hash),
          hashToken: (token: string) => bcrypt.hash(token, 10),
        });
      },
      inject: [PrismaAuthRepository, ConfigService],
    },
    {
      provide: GoogleAuthUseCase,
      useFactory: (repo: PrismaAuthRepository, config: ConfigService) => {
        const jwtService = new JwtService({
          secret: config.get<string>('JWT_SECRET') ?? 'dev-secret',
          signOptions: { expiresIn: '15m' },
        });
        const refreshJwtService = new JwtService({
          secret: config.get<string>('JWT_REFRESH_SECRET') ?? 'dev-refresh-secret',
          signOptions: { expiresIn: '7d' },
        });

        return new GoogleAuthUseCase({
          upsertGoogleUser: (data) => repo.upsertGoogleUser(data),
          signAccessToken: (payload: { sub: string; email: string }) => jwtService.sign(payload),
          signRefreshToken: (payload: { sub: string; email: string }) => refreshJwtService.sign(payload),
          updateRefreshToken: (userId: string, hash: string) => repo.updateRefreshToken(userId, hash),
          hashToken: (token: string) => bcrypt.hash(token, 10),
        });
      },
      inject: [PrismaAuthRepository, ConfigService],
    },
  ],
  exports: [JwtStrategy, PrismaAuthRepository],
})
export class AuthModule {}
