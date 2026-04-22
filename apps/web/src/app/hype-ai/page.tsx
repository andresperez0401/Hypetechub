'use client';

import { useCallback, useRef, useState } from 'react';
import { apiClient } from '@/lib/api/client';

interface Message { role: 'user' | 'assistant'; content: string; }

export default function HypeAiPage(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await apiClient.post<{ reply: string }>('/hype-ai/chat', {
        message: userMessage.content,
        conversationHistory: messages,
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, ocurrió un error. Inténtalo de nuevo.' }]);
    } finally {
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  }, [input, isLoading, messages, scrollToBottom]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendMessage(); }
  };

  const suggestions = [
    '¿Cuál es el video con más hype y por qué?',
    '¿Qué tutoriales tienen mejor rendimiento?',
    '¿Cómo se calcula el hype score?',
    '¿Qué videos no tienen comentarios?',
    '¿Qué autores aparecen más?',
  ];

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-6 sm:px-6 lg:px-8" style={{ height: 'calc(100vh - 120px)' }}>
      <div className="mb-4 text-center group">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 relative overflow-hidden transition-all duration-700 hover:shadow-indigo-500/20">
          <img src="/logo.png" alt="Hype AI Bot" className="h-10 w-10 object-contain drop-shadow-sm transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Hype AI</h1>
        <p className="mt-1 text-sm text-slate-400">Pregúntame sobre los videos, tendencias y hype scores del catálogo</p>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center space-y-5 py-8">
            <p className="text-sm text-slate-500">Elige una pregunta o escribe la tuya:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map(s => (
                <button key={s} type="button" onClick={() => setInput(s)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: 'fadeInUp 0.3s ease' }}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-slate-100 text-slate-700 rounded-bl-md'}`}>
              {msg.role === 'assistant' && <div className="mb-1.5 text-xs font-semibold text-indigo-600">🤖 Hype AI</div>}
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start" style={{ animation: 'fadeInUp 0.3s ease' }}>
            <div className="rounded-2xl rounded-bl-md bg-slate-100 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '300ms' }} />
                </span>
                Pensando...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-3 flex items-end gap-2">
        <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
          placeholder="Pregunta sobre videos, hype, autores..."
          rows={1} disabled={isLoading}
          className="input-field flex-1 resize-none" />
        <button type="button" onClick={() => void sendMessage()} disabled={!input.trim() || isLoading}
          className="btn-primary rounded-xl px-4 py-3">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
