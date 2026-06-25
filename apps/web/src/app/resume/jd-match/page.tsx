'use client';
import { useState, useEffect } from 'react';
import PageShell from '@/components/layout/PageShell';
import { useApiClient } from '@/lib/api';
import { EmptyState } from '@/components/ui/empty-state';
import type { JDMatch } from '@/types';

export default function JDMatchPage() {
  const { post, get } = useApiClient();
  const [jd, setJd] = useState('');
  const [label, setLabel] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<JDMatch | null>(null);
  const [history, setHistory] = useState<JDMatch[]>([]);

  useEffect(() => {
    get<{ matches: JDMatch[] }>('/api/jd-match').then((r) => setHistory(r.matches)).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jd.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await post<{ match: JDMatch }>('/api/jd-match', { jobDescription: jd, label });
      setResult(res.match);
      setHistory((prev) => [res.match, ...prev]);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  if (error.includes('No active resume')) return <PageShell><EmptyState message="Upload a resume first." ctaHref="/resume" ctaLabel="Upload Resume" /></PageShell>;

  const scoreColor = (s: number) => s >= 70 ? '#4ade80' : s >= 50 ? '#facc15' : '#f87171';

  return (
    <PageShell>
      <h1 className="text-xl font-bold mb-5">JD Matching</h1>
      <form onSubmit={handleSubmit} className="card p-5 mb-5 space-y-3">
        <div>
          <label htmlFor="jd" className="block text-sm font-medium mb-1">Job Description <span className="text-xs" style={{ color: 'hsl(215,20%,65%)' }}>(max 5000 chars)</span></label>
          <textarea id="jd" value={jd} onChange={(e) => setJd(e.target.value.slice(0, 5000))} rows={6}
            className="input rounded-lg resize-none" placeholder="Paste the job description here…" required />
          <p className="text-xs mt-1" style={{ color: 'hsl(215,20%,65%)' }}>{jd.length}/5000</p>
        </div>
        <div>
          <label htmlFor="label" className="block text-sm font-medium mb-1">Label <span className="text-xs" style={{ color: 'hsl(215,20%,65%)' }}>(optional)</span></label>
          <input id="label" value={label} onChange={(e) => setLabel(e.target.value.slice(0, 100))}
            className="input rounded-lg" placeholder="e.g. Senior Frontend at Acme" />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading || !jd.trim()} className="btn-primary rounded-xl">
          {loading ? 'Matching…' : 'Match Resume'}
        </button>
      </form>

      {result && (
        <div className="card p-5 mb-5">
          <div className="text-center mb-5">
            <div className="text-4xl font-bold mb-1" style={{ color: scoreColor(result.compatibilityScore) }}>{result.compatibilityScore}%</div>
            <p className="text-xs" style={{ color: 'hsl(215,20%,65%)' }}>Compatibility Score</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mb-4">
            <div><h3 className="text-sm font-semibold text-green-400 mb-2">Matched Skills</h3><div className="flex flex-wrap gap-1.5">{result.matchedSkills.map((s, i) => <span key={i} className="tag-green">{s}</span>)}</div></div>
            <div><h3 className="text-sm font-semibold text-red-400 mb-2">Missing Skills</h3><div className="flex flex-wrap gap-1.5">{result.missingSkills.map((s, i) => <span key={i} className="tag-red">{s}</span>)}</div></div>
          </div>
          {result.recommendedActions.length > 0 && (
            <div><h3 className="text-sm font-semibold mb-2">Recommended Actions</h3><ul className="space-y-1">{result.recommendedActions.map((a, i) => <li key={i} className="text-sm" style={{ color: 'hsl(215,20%,65%)' }}>• {a}</li>)}</ul></div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'hsl(215,20%,65%)' }}>Saved Results</h2>
          <div className="space-y-2">
            {history.map((m) => (
              <div key={m._id} className="card p-3 flex items-center gap-3 text-sm">
                <span className="font-bold text-base" style={{ color: scoreColor(m.compatibilityScore) }}>{m.compatibilityScore}%</span>
                <span className="flex-1" style={{ color: 'hsl(215,20%,65%)' }}>{m.label || 'Unnamed'}</span>
                <span className="text-xs" style={{ color: 'hsl(215,20%,50%)' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
