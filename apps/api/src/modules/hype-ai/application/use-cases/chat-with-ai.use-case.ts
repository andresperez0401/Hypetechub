import type { ChatInput, ChatOutput } from '../types';

export interface ChatDependencies {
  getVideoContext: () => Promise<string>;
  callDeepSeek: (systemPrompt: string, messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) => Promise<string>;
}

export class ChatWithAiUseCase {
  constructor(private readonly deps: ChatDependencies) {}

  async execute(input: ChatInput): Promise<ChatOutput> {
    const videoContext = await this.deps.getVideoContext();

    const systemPrompt = `Eres Hype AI, el asistente inteligente de "Hype Tech Hub" — una plataforma que clasifica videos de tecnología por su nivel de engagement (hype score).

Tu rol:
- Ayudar a los usuarios a descubrir videos según sus intereses
- Explicar cómo se calcula el hype score
- Dar insights sobre contenido trending
- Comparar videos, autores y temas
- Responder SIEMPRE en español

Fórmula del Hype Score:
- Base: (likes + comentarios) / vistas
- Si el título contiene "Tutorial" (sin importar mayúsculas): el hype se multiplica por 2
- Si no tiene comentarios (commentCount faltante): hype = 0
- Si las vistas son 0: hype = 0

Datos disponibles del catálogo:
${videoContext}

Reglas estrictas:
- Solo referencia videos que existan en los datos de arriba
- Si te preguntan algo fuera del dataset, dilo claramente: "Esa información no está en el catálogo actual"
- Sé conversacional, amigable y entusiasta sobre tecnología
- Mantén respuestas concisas pero informativas
- Responde SIEMPRE en español`;

    const messages: { role: 'user' | 'assistant' | 'system'; content: string }[] = [
      { role: 'system', content: systemPrompt },
    ];

    if (input.conversationHistory) {
      for (const msg of input.conversationHistory) {
        messages.push(msg);
      }
    }

    messages.push({ role: 'user', content: input.message });

    const reply = await this.deps.callDeepSeek(systemPrompt, messages);

    return { reply };
  }
}
