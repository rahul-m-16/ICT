'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageShell from '@/components/layout/PageShell';
import { useApiClient } from '@/lib/api';
import type { InterviewSession } from '@/types';

export default function FeedbackPage() {
  const { id } = useParams<{ id: string }>();
  const { get } = useApiClient();
  const [session, setSession] = useState<InterviewSession | null>(null);

  useEffect(() => {
    get<{ session: InterviewSession }>(`/api/interview/session/${id}`).then((r) => setSession(r.session)).catch(() => {});
  }, [id]);

  if (!session) return <PageShell><div className="animate-pulse h-64 bg-white/5 rounded-xl" /></PageShell>;

  const scoreColor = (v: number) => v >= 7 ? '#4ade80' : v >= 5 ? '#facc15' : '#f87171';

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-xl font-bold mb-1">Interview Feedback</h1>
        <p className="text-sm mb-5" style={{ color: 'hsl(215,20%,65%)' }}>{session.targetRole} — {session.interviewType} — {session.difficulty}</p>

        <div className="card p-5 text-center mb-6">
          <p className="text-xs mb-1" style={{ color: 'hsl(215,20%,65%)' }}>Overall Score</p>
          <div className="text-5xl font-bold" style={{ color: scoreColor(session.overallScore) }}>{session.overallScore.toFixed(1)}</div>
          <p className="text-xs mt-1" style={{ color: 'hsl(215,20%,65%)' }}>out of 10</p>
        </div>

        <div className="space-y-4 mb-6">
          {session.questions.map((q, i) => (
            <div key={i} className="card p-4">
              <p className="font-medium text-sm mb-1">Q{i + 1}: {q.questionText}</p>
              <p className="text-xs italic mb-3" style={{ color: 'hsl(215,20%,65%)' }}>"{q.userResponse || '(no answer)'}"</p>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[['Clarity', q.feedback.communicationClarity], ['Depth', q.feedback.technicalDepth], ['Confidence', q.feedback.confidenceIndicators], ['Relevance', q.feedback.answerRelevance]].map(([label, val]) => (
                  <div key={label as string} className="text-center">
                    <div className="text-xl font-bold" style={{ color: scoreColor(val as number) }}>{val ?? '—'}</div>
                    <div className="text-xs" style={{ color: 'hsl(215,20%,65%)' }}>{label}</div>
                  </div>
                ))}
              </div>
              {q.feedback.improvementSuggestion && (
                <p className="text-xs px-3 py-2 rounded-lg" style={{ background: 'rgba(250,204,21,0.08)', color: '#facc15' }}>💡 {q.feedback.improvementSuggestion}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/interview" className="btn-primary rounded-xl px-6">New Interview</Link>
          <Link href="/progress" className="btn-ghost rounded-xl px-6">View Progress</Link>
        </div>
      </div>
    </PageShell>
  );
}
