'use client';
import { useState, useRef, useEffect } from 'react';
import PageShell from '@/components/layout/PageShell';
import { useAIStream } from '@/hooks/useAIStream';
import { useVoice } from '@/hooks/useVoice';
import { Send, Trash2, Mic, MicOff } from 'lucide-react';

export default function ChatPage() {
  const { messages, sendMessage, isStreaming, clearConversation } = useAIStream();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isRecording, voiceUnavailable, startRecording, stopRecording } = useVoice((t) => setInput(t));

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    const msg = input.trim(); setInput('');
    await sendMessage(msg);
  };

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">AI Chat</h1>
        <button onClick={clearConversation} className="btn-ghost px-3 py-2 rounded-lg text-xs flex items-center gap-1.5">
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="card p-4 flex flex-col" style={{ height: 'calc(100vh - 14rem)' }}>
        <div className="flex-1 overflow-y-auto space-y-3 pb-2">
          {messages.length === 0 && (
            <p className="text-sm text-center mt-10" style={{ color: 'hsl(215,20%,65%)' }}>Ask me anything about your career…</p>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap"
                style={m.role === 'user'
                  ? { background: 'rgba(6,182,212,0.2)', color: 'hsl(210,40%,98%)' }
                  : { background: 'rgba(255,255,255,0.05)', color: 'hsl(210,40%,98%)' }}>
                {m.content || <span className="opacity-50 italic">Thinking…</span>}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} className="flex gap-2 mt-3 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message…"
            className="input flex-1 rounded-lg" disabled={isStreaming} />
          {!voiceUnavailable && (
            <button type="button" onClick={isRecording ? stopRecording : startRecording}
              className={`btn-ghost w-11 h-11 rounded-lg flex items-center justify-center p-0 ${isRecording ? 'text-red-400' : ''}`}>
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
          <button type="submit" disabled={isStreaming || !input.trim()} className="btn-primary w-11 h-11 rounded-lg flex items-center justify-center p-0">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </PageShell>
  );
}
