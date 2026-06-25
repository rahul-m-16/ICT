'use client';
import { useState } from 'react';
import PageShell from '@/components/layout/PageShell';
import { useApiClient } from '@/lib/api';
import { EmptyState } from '@/components/ui/empty-state';

interface ATSResult { score: number; strengths: string[]; weaknesses: string[]; missingKeywords: string[]; formattingFeedback: string; }

export default function ATSPage() {
  const { post } = useApiClient();
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async () => {
    setLoading(true); setError('');
    try { setResult((await post<{ analysis: ATSResult }>('/api/ats/analyze')).analysis); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const scoreColor = result ? (result.score >= 70 ? '#4ade80' : result.score >= 50 ? '#facc15' : '#f87171') : '';

  return (
    <PageShell>
      <h1 className="text-xl font-bold mb-5">ATS Analysis</h1>
      {error.includes('No active resume') ? (
        <EmptyState message="Upload a resume first to run ATS analysis." ctaHref="/resume" ctaLabel="Upload Resume" />
      ) : (
        <>
          <button onClick={analyze} disabled={loading} className="btn-primary rounded-xl mb-5">
            {loading ? 'Analyzing…' : 'Analyze My Resume'}
          </button>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          {result && (
            <div className="card p-5">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold mb-1" style={{ color: scoreColor }}>{result.score}</div>
                <p className="text-xs" style={{ color: 'hsl(215,20%,65%)' }}>out of 100</p>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <h2 className="text-sm font-semibold text-green-400 mb-2">✓ Strengths</h2>
                  <ul className="space-y-1">{result.strengths.map((s, i) => <li key={i} className="text-sm" style={{ color: 'hsl(215,20%,65%)' }}>• {s}</li>)}</ul>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-red-400 mb-2">✗ Weaknesses</h2>
                  <ul className="space-y-1">{result.weaknesses.map((w, i) => <li key={i} className="text-sm" style={{ color: 'hsl(215,20%,65%)' }}>• {w}</li>)}</ul>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-yellow-400 mb-2">Missing Keywords</h2>
                  <div className="flex flex-wrap gap-1.5">{result.missingKeywords.map((k, i) => <span key={i} className="tag-yellow">{k}</span>)}</div>
                </div>
                <div>
                  <h2 className="text-sm font-semibold mb-2">Formatting</h2>
                  <p className="text-sm" style={{ color: 'hsl(215,20%,65%)' }}>{result.formattingFeedback}</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
