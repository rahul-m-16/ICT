'use client';

import { useState, useCallback } from 'react';
import { useApiClient } from '@/lib/api';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function useAIStream() {
  const { streamChat, del } = useApiClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '' };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    try {
      for await (const token of streamChat(text)) {
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: m.content + token } : m)
        );
      }
    } finally {
      setIsStreaming(false);
    }
  }, [streamChat]);

  const clearConversation = useCallback(async () => {
    try { await del('/api/chat/session'); } catch { /* ignore */ }
    setMessages([]);
  }, [del]);

  return { messages, sendMessage, isStreaming, clearConversation };
}
