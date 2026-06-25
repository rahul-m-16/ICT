'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import PageShell from '@/components/layout/PageShell';
import { useApiClient } from '@/lib/api';
import { EmptyState } from '@/components/ui/empty-state';
import type { SkillGapResult } from '@/types';

const RadarChart = dynamic(() => import('recharts').then((m) => ({ default: m.RadarChart })), { ssr: false });
const Radar = dynamic(() => import('recharts').then((m) => ({ default: m.Radar })), { ssr: false });
const PolarGrid = dynamic(() => import('recharts').then((m) => ({ default: m.PolarGrid })), { ssr: false });
const PolarAngleAxis = dynamic(() => import('recharts').then((m) => ({ default: m.PolarAngleAxis })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((m) => ({ default: m.ResponsiveContainer })), { ssr: false });

export default function SkillGapPage() {
  const { post } = useApiClient();
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) return;
    setLoading(true); setError('');
    try { setResult((await post<{ skillGap: SkillGapResult }>('/api/skill-gap/analyze', { targetRole })).skillGap); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const radarData = result ? [
    { skill: 'Present', value: result.present.length },
    { skill: 'Partial', value: result.partiallyPresent.length },
    { skill: 'Missing', value: result.missing.length },
  ] : [];

  return (
    <PageShell>
      <h1 className="text-xl font-bold mb-5">Skill Gap Analysis</h1>
      {error.includes('No active resume') ? (
        <EmptyState message="Upload a resume first." ctaHref="/resume" ctaLabel="Upload Resume" />
      ) : (
        <>
          <form onSubmit={analyze} className="card p-5 mb-5 flex gap-3">
            <input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Target role (e.g. ML Engineer)"
              className="input rounded-lg flex-1" required />
            <button type="submit" disabled={loading || !targetRole.trim()} className="btn-primary rounded-xl whitespace-nowrap">
              {loading ? 'Analyzing…' : 'Analyze'}
            </button>
          </form>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          {result && (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="card p-4" style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="skill" tick={{ fill: 'hsl(215,20%,65%)', fontSize: 12 }} />
                    <Radar dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {[['✓ Present', result.present, 'tag-green'], ['~ Partial', result.partiallyPresent, 'tag-yellow'], ['✗ Missing', result.missing, 'tag-red']].map(([label, skills, cls]) => (
                  <div key={label as string}>
                    <h3 className="text-sm font-semibold mb-2">{label}</h3>
                    <div className="flex flex-wrap gap-1.5">{(skills as string[]).map((s) => <span key={s} className={cls as string}>{s}</span>)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </PageShell>
  );
}
