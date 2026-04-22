export interface ChatInput {
  message: string;
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[];
}

export interface ChatOutput {
  reply: string;
  sources?: string[];
}
