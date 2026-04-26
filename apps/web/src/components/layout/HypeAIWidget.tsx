'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

interface Message { role: 'user' | 'assistant'; content: string; }

export function HypeAIWidget(): JSX.Element | null {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) setTimeout(scrollToBottom, 100);
  }, [isOpen, messages, scrollToBottom]);

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
    '¿Cuál es el video con más hype?',
    '¿Qué tutoriales rinden mejor?',
    '¿Cómo se calcula el hype score?',
    '¿Qué autores aparecen más?',
  ];

  if (pathname === '/hype-ai') return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex w-80 sm:w-96 flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
          style={{ height: '480px' }}>
          {/* Header */}
          <div className="flex items-center gap-2 bg-indigo-600 px-4 py-3">
            <img src="/logo.png" alt="Hype AI" className="h-6 w-6 object-contain brightness-0 invert" />
            <span className="flex-1 text-sm font-semibold text-white">Hype AI</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-indigo-200 transition hover:bg-indigo-500 hover:text-white"
              aria-label="Cerrar"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-3 py-4">
                <p className="text-xs text-slate-400 text-center">Elige una pregunta o escribe la tuya:</p>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {suggestions.map(s => (
                    <button key={s} type="button" onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                      className="rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-md' : 'bg-white text-slate-700 rounded-bl-md border border-slate-100 shadow-sm'}`}>
                  {msg.role === 'assistant' && <div className="mb-1 text-[10px] font-semibold text-indigo-500">🤖 Hype AI</div>}
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md bg-white border border-slate-100 shadow-sm px-3 py-2">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex items-end gap-2 border-t border-slate-200 bg-white p-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pregunta sobre videos, hype..."
              rows={1}
              disabled={isLoading}
              className="input-field flex-1 resize-none text-xs py-2 px-3 min-h-[36px] max-h-20"
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={!input.trim() || isLoading}
              className="btn-primary rounded-xl px-3 py-2 flex-shrink-0"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/40 transition-all hover:bg-indigo-700 hover:scale-105 hover:shadow-indigo-500/60 active:scale-95"
        aria-label="Abrir Hype AI"
      >
        {isOpen ? (
          <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.221-1.15-2.136-2.389-2.097a48.045 48.045 0 00-10.47 0C3.39 4.58 2.25 5.495 2.25 6.637v4.286c0 1.136.847 2.1 1.98 2.193.34.027.68.052 1.02.072v3.091l3-3c1.354 0 2.694.055 4.02.163m-4.5-3.5h.01M15 12h.01M9 12h.01" />
          </svg>
        )}
      </button>
    </div>
  );
}
