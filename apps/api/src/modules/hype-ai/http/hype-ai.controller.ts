import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChatWithAiUseCase } from '../application/use-cases/chat-with-ai.use-case';
import { ChatRequestDto } from '../infrastructure/http/dtos/chat.request.dto';

@ApiTags('hype-ai')
@Controller('hype-ai')
export class HypeAiController {
  constructor(private readonly chatUseCase: ChatWithAiUseCase) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with Hype AI about tech videos' })
  @ApiBody({ type: ChatRequestDto })
  @ApiResponse({ status: 200, description: 'AI response', schema: { properties: { reply: { type: 'string' } } } })
  async chat(@Body() dto: ChatRequestDto): Promise<{ reply: string }> {
    const result = await this.chatUseCase.execute({
      message: dto.message,
      conversationHistory: dto.conversationHistory,
    });
    return { reply: result.reply };
  }
}
