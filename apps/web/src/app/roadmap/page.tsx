'use client';
import { useState, useEffect } from 'react';
import PageShell from '@/components/layout/PageShell';
import { useApiClient } from '@/lib/api';
import type { Roadmap } from '@/types';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';

const DURATIONS = ['1 month', '3 months', '6 months', '1 year', '2 years'];

export default function RoadmapPage() {
  const { post, get, patch } = useApiClient();
  const [form, setForm] = useState({ targetRole: '', targetDuration: '3 months' });
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    get<{ roadmaps?: Roadmap[] }>('/api/roadmap/latest').then((r) => { if (r.roadmaps?.[0]) setRoadmap(r.roadmaps[0]); }).catch(() => {});
  }, []);

  const generate = async (force = false) => {
    setLoading(true); setError('');
    try { setRoadmap((await post<{ roadmap: Roadmap }>('/api/roadmap', { ...form, force })).roadmap); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  };

  const togglePhase = async (phaseNumber: number, completed: boolean) => {
    if (!roadmap) return;
    try {
      const res = await patch<{ roadmap: Roadmap }>(`/api/roadmap/${roadmap._id}/phase/${phaseNumber}`, { completed });
      setRoadmap(res.roadmap);
    } catch { /* ignore */ }
  };

  return (
    <PageShell>
      <h1 className="text-xl font-bold mb-5">Career Roadmap</h1>
      <div className="card p-5 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <input placeholder="Target Role (e.g. Staff Engineer)" className="input rounded-lg flex-1"
            value={form.targetRole} onChange={(e) => setForm((f) => ({ ...f, targetRole: e.target.value }))} />
          <select className="input rounded-lg sm:w-40" value={form.targetDuration}
            onChange={(e) => setForm((f) => ({ ...f, targetDuration: e.target.value }))}>
            {DURATIONS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <button onClick={() => generate()} disabled={loading || !form.targetRole.trim()} className="btn-primary rounded-xl whitespace-nowrap">
            {loading ? 'Generating…' : 'Generate'}
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {roadmap && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">{roadmap.targetRole}</h2>
            <span className="text-sm" style={{ color: '#22d3ee' }}>{roadmap.completionPercentage}% complete</span>
          </div>
          <div className="space-y-4">
            {roadmap.phases.map((phase) => (
              <div key={phase.phaseNumber} className="card p-4">
                <div className="flex items-start gap-3 mb-3">
                  <button onClick={() => togglePhase(phase.phaseNumber, !phase.completed)} className="mt-0.5 shrink-0">
                    {phase.completed ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5" style={{ color: 'hsl(215,20%,50%)' }} />}
                  </button>
                  <div>
                    <p className="font-medium text-sm">Phase {phase.phaseNumber}: {phase.title}</p>
                    {phase.skills.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{phase.skills.map((s) => <span key={s} className="tag-green">{s}</span>)}</div>}
                  </div>
                </div>
                {phase.resources.length > 0 && (
                  <div className="ml-8 space-y-1">
                    {phase.resources.slice(0, 3).map((r, i) => (
                      <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                        <ExternalLink className="w-3 h-3" />{r.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
