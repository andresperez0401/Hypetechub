import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/refresh-token.use-case';
import { GoogleAuthUseCase } from '../application/use-cases/google-auth.use-case';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../infrastructure/guards/google-auth.guard';
import { PrismaAuthRepository } from '../infrastructure/repositories/prisma-auth.repository';
import { AuthResponseDto } from '../infrastructure/http/dtos/auth.response.dto';
import { LoginRequestDto } from '../infrastructure/http/dtos/login.request.dto';
import { RegisterRequestDto } from '../infrastructure/http/dtos/register.request.dto';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');

const isProduction = process.env.NODE_ENV === 'production';
// Cross-site cookies (frontend on hypetechub.online, API on *.railway.app) require
// SameSite=None + Secure so the browser attaches the cookie on cross-origin XHR
// (e.g. /auth/me). In dev (http://localhost) fall back to lax, which works same-origin.
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
  path: '/',
  // Only set Domain when explicitly configured AND it matches the API host
  // (a mismatched Domain attribute causes the browser to silently reject the cookie).
  ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}),
};

function getUserFromReq(req: unknown): { userId: string; email: string } | undefined {
  const r = req as { user?: { userId: string; email: string } };
  return r.user;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly googleAuthUseCase: GoogleAuthUseCase,
    private readonly authRepo: PrismaAuthRepository,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() dto: LoginRequestDto, @Res({ passthrough: true }) res: unknown): Promise<AuthResponseDto> {
    const result = await this.loginUseCase.execute(dto);
    const response = res as { cookie: (name: string, value: string, opts: Record<string, unknown>) => void };

    if (result.accessToken && result.refreshToken) {
      response.cookie('access_token', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
      response.cookie('refresh_token', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    }

    return result;
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterRequestDto })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  async register(@Body() dto: RegisterRequestDto, @Res({ passthrough: true }) res: unknown): Promise<AuthResponseDto> {
    const result = await this.registerUseCase.execute(dto);
    const response = res as { cookie: (name: string, value: string, opts: Record<string, unknown>) => void };

    if (result.accessToken && result.refreshToken) {
      response.cookie('access_token', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
      response.cookie('refresh_token', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    }

    return result;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, type: AuthResponseDto })
  async refresh(@Req() req: unknown, @Res({ passthrough: true }) res: unknown): Promise<AuthResponseDto> {
    const r = req as { cookies?: { refresh_token?: string } };
    const refreshToken = r.cookies?.refresh_token;
    const jwtUser = getUserFromReq(req);

    const result = await this.refreshTokenUseCase.execute(jwtUser?.userId, refreshToken);
    const response = res as { cookie: (name: string, value: string, opts: Record<string, unknown>) => void };

    if (result.accessToken && result.refreshToken) {
      response.cookie('access_token', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
      response.cookie('refresh_token', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    }

    return result;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and clear session' })
  @ApiResponse({ status: 200 })
  logout(@Res({ passthrough: true }) res: unknown): { status: string; message: string } {
    const response = res as { clearCookie: (name: string, opts: Record<string, unknown>) => void };
    response.clearCookie('access_token', COOKIE_OPTIONS);
    response.clearCookie('refresh_token', COOKIE_OPTIONS);
    return { status: 'success', message: 'Logged out successfully.' };
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth login' })
  google(): void {
    // Guard redirects to Google consent screen
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleCallback(@Req() req: unknown, @Res() res: unknown): Promise<void> {
    const r = req as { user?: { googleId: string; email: string; displayName: string | null; avatarUrl: string | null } };
    const googleProfile = r.user;
    const result = await this.googleAuthUseCase.execute(googleProfile ?? undefined);

    const response = res as {
      cookie: (name: string, value: string, opts: Record<string, unknown>) => void;
      redirect: (url: string) => void;
    };

    if (result.accessToken && result.refreshToken) {
      response.cookie('access_token', result.accessToken, { ...COOKIE_OPTIONS, maxAge: 15 * 60 * 1000 });
      response.cookie('refresh_token', result.refreshToken, { ...COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
    }

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    response.redirect(`${frontendUrl}/?auth=success`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@Req() req: unknown): Promise<{ user: { id: string; email: string; displayName: string | null; avatarUrl: string | null } | null }> {
    const jwtUser = getUserFromReq(req);
    if (!jwtUser) {
      return { user: null };
    }
    const user = await this.authRepo.findUserById(jwtUser.userId);
    if (!user) {
      return { user: null };
    }
    return {
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
      },
    };
  }
}
