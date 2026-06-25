'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import PageShell from '@/components/layout/PageShell';
import { useApiClient } from '@/lib/api';
import type { InterviewSession } from '@/types';

export default function InterviewSessionPage() {
  const { id } = useParams<{ id: string }>();
  const { get, post } = useApiClient();
  const router = useRouter();
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [abandonConfirm, setAbandonConfirm] = useState(false);

  useEffect(() => {
    get<{ session: InterviewSession }>(`/api/interview/session/${id}`).then((r) => {
      setSession(r.session);
      const idx = r.session.questions.findIndex((q) => !q.userResponse);
      setCurrentIndex(idx === -1 ? r.session.questions.length - 1 : idx);
    }).catch(() => {});
  }, [id]);

  const submitAnswer = async () => {
    if (!answer.trim() || !session) return;
    setSubmitting(true);
    try {
      const res = await post<{ session: InterviewSession }>(`/api/interview/session/${id}/response`, { response: answer, questionIndex: currentIndex });
      setSession(res.session); setAnswer('');
      const next = currentIndex + 1;
      if (next >= res.session.questions.length) {
        await post(`/api/interview/session/${id}/complete`, {});
        router.push(`/interview/session/${id}/feedback`);
      } else { setCurrentIndex(next); }
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  if (!session) return <PageShell><div className="animate-pulse h-64 bg-white/5 rounded-xl" /></PageShell>;

  const q = session.questions[currentIndex];
  const progress = ((currentIndex + 1) / session.questions.length) * 100;
  const isLast = currentIndex + 1 === session.questions.length;

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">{session.targetRole} — {session.interviewType}</p>
          <button onClick={() => setAbandonConfirm(true)} className="text-xs" style={{ color: 'hsl(215,20%,65%)' }}>Abandon</button>
        </div>
        <div className="h-1 bg-white/5 rounded-full mb-1">
          <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs mb-5" style={{ color: 'hsl(215,20%,65%)' }}>Question {currentIndex + 1} of {session.questions.length}</p>

        <div className="card p-5 mb-4">
          <p className="font-medium leading-relaxed">{q?.questionText}</p>
        </div>

        <label htmlFor="answer" className="block text-sm font-medium mb-1.5">Your Answer</label>
        <textarea id="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} rows={6}
          className="input rounded-xl resize-none mb-3" placeholder="Type your answer here…" />

        <button onClick={submitAnswer} disabled={submitting || !answer.trim()} className="btn-primary w-full rounded-xl">
          {submitting ? (isLast ? 'Evaluating…' : 'Saving…') : isLast ? 'Finish & Get Feedback' : 'Next Question →'}
        </button>

        {abandonConfirm && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.6)' }} role="dialog" aria-modal>
            <div className="card p-5 max-w-sm w-full space-y-3">
              <h2 className="font-bold">Abandon Session?</h2>
              <p className="text-sm" style={{ color: 'hsl(215,20%,65%)' }}>Your progress won't be saved.</p>
              <div className="flex gap-2">
                <button onClick={async () => { await post(`/api/interview/session/${id}/abandon`, {}); router.push('/interview'); }}
                  className="flex-1 py-2 rounded-lg text-sm text-red-400" style={{ background: 'rgba(248,113,113,0.1)' }}>Abandon</button>
                <button onClick={() => setAbandonConfirm(false)} className="btn-ghost flex-1 rounded-lg text-sm">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
