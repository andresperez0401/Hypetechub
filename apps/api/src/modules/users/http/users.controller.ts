import { Controller, Get, Headers } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetMyProfileUseCase } from '../application/use-cases/get-my-profile.use-case';
import { UserProfileResponseDto } from '../infrastructure/http/dtos/user-profile.response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly getMyProfileUseCase: GetMyProfileUseCase) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: UserProfileResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  getMe(@Headers('x-user-id') userId: string): Promise<UserProfileResponseDto> {
    // UserNotFoundError is caught by DomainExceptionFilter → 404
    return this.getMyProfileUseCase.execute(userId);
  }
}
