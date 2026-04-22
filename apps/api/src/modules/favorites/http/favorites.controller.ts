import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { AddFavoriteUseCase } from '../application/use-cases/add-favorite.use-case';
import { ListFavoritesUseCase } from '../application/use-cases/list-favorites.use-case';
import { RemoveFavoriteUseCase } from '../application/use-cases/remove-favorite.use-case';
import { AddFavoriteRequestDto } from '../infrastructure/http/dtos/add-favorite.request.dto';
import { FavoriteResponseDto } from '../infrastructure/http/dtos/favorite.response.dto';
import { JwtAuthGuard } from '../../auth/infrastructure/guards/jwt-auth.guard';

function getUserId(req: Request): string {
  const user = (req as unknown as Record<string, { userId: string }>).user;
  return user?.userId ?? '';
}

@ApiTags('favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(
    private readonly listFavoritesUseCase: ListFavoritesUseCase,
    private readonly addFavoriteUseCase: AddFavoriteUseCase,
    private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List favorites for the authenticated user' })
  @ApiResponse({ status: 200, type: [FavoriteResponseDto] })
  list(@Req() req: Request): Promise<FavoriteResponseDto[]> {
    return this.listFavoritesUseCase.execute(getUserId(req));
  }

  @Post()
  @ApiOperation({ summary: 'Add a video to favorites' })
  @ApiBody({ type: AddFavoriteRequestDto })
  @ApiResponse({ status: 201, type: FavoriteResponseDto })
  @ApiResponse({ status: 409, description: 'Favorite already exists' })
  create(
    @Req() req: Request,
    @Body() dto: AddFavoriteRequestDto,
  ): Promise<FavoriteResponseDto> {
    return this.addFavoriteUseCase.execute(getUserId(req), { videoId: dto.videoId });
  }

  @Delete(':videoId')
  @ApiOperation({ summary: 'Remove a video from favorites' })
  @ApiResponse({ status: 200, description: 'Favorite removed' })
  async remove(
    @Req() req: Request,
    @Param('videoId') videoId: string,
  ): Promise<{ status: string }> {
    await this.removeFavoriteUseCase.execute(getUserId(req), videoId);
    return { status: 'removed' };
  }
}
