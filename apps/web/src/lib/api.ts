'use client';

import { useAuth } from '@clerk/nextjs';

const BASE = process.env['NEXT_PUBLIC_API_URL'] ?? '';

export function useApiClient() {
  const { getToken } = useAuth();

  async function headers() {
    const token = await getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  async function get<T>(path: string): Promise<T> {
    const res = await fetch(`${BASE}${path}`, { headers: await headers() });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as T;
  }

  async function post<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: await headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as T;
  }

  async function patch<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method: 'PATCH',
      headers: await headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as T;
  }

  async function del<T>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
      method: 'DELETE',
      headers: await headers(),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as T;
  }

  async function postForm<T>(path: string, form: FormData): Promise<T> {
    const token = await getToken();
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as T;
  }

  async function* streamChat(message: string, sessionId?: string): AsyncGenerator<string> {
    const token = await getToken();
    const res = await fetch(`${BASE}/api/chat/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ message, sessionId }),
    });
    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data === '[DONE]') return;
          try {
            const parsed = JSON.parse(data) as { token?: string };
            if (parsed.token) yield parsed.token;
          } catch { /* skip malformed */ }
        }
      }
    }
  }

  return { get, post, patch, del, postForm, streamChat };
}
