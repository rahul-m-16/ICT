'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export function useVoice(onTranscript?: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceUnavailable, setVoiceUnavailable] = useState(false);
  const [paused, setPaused] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const SR = (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      ?? (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SR) { setVoiceUnavailable(true); return; }

    const recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const t = Array.from(e.results).map((r) => r[0]?.transcript ?? '').join('');
      setTranscript(t);
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
      silenceTimer.current = setTimeout(() => stopRecording(), 2000);
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognitionRef.current = recognition;

    const handleVisibility = () => {
      if (document.hidden && isRecording) { stopRecording(); setPaused(true); }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const startRecording = useCallback(() => {
    if (!recognitionRef.current || isRecording) return;
    setTranscript('');
    setPaused(false);
    recognitionRef.current.start();
    setIsRecording(true);
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    if (!recognitionRef.current || !isRecording) return;
    recognitionRef.current.stop();
    setIsRecording(false);
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    if (transcript && onTranscript) onTranscript(transcript);
  }, [isRecording, transcript, onTranscript]);

  return { isRecording, transcript, voiceUnavailable, paused, startRecording, stopRecording };
}
