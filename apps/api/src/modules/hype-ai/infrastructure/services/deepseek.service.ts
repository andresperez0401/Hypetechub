import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DeepSeekService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.deepseek.com/v1';

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('DEEPSEEK_API_KEY', '');
  }

  async chat(messages: { role: string; content: string }[]): Promise<string> {
    if (!this.apiKey) {
      return 'Hype AI is not configured yet. Please set the DEEPSEEK_API_KEY environment variable.';
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json() as {
        choices: { message: { content: string } }[];
      };

      return data.choices[0]?.message?.content ?? 'No response from AI.';
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to get AI response: ${error.message}`);
      }
      throw new Error('Failed to get AI response');
    }
  }
}
