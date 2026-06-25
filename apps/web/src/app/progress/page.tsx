'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PageShell from '@/components/layout/PageShell';
import { useApiClient } from '@/lib/api';
import { EmptyState } from '@/components/ui/empty-state';
import type { ProgressData } from '@/types';

const LineChart = dynamic(() => import('recharts').then((m) => ({ default: m.LineChart })), { ssr: false });
const Line = dynamic(() => import('recharts').then((m) => ({ default: m.Line })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((m) => ({ default: m.XAxis })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((m) => ({ default: m.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((m) => ({ default: m.ResponsiveContainer })), { ssr: false });

function Chart({ data, dataKey, color, label }: { data: object[]; dataKey: string; color: string; label: string }) {
  if (data.length < 2) return <p className="text-xs text-center py-6" style={{ color: 'hsl(215,20%,65%)' }}>Complete more activities to see {label} trend.</p>;
  return (
    <div style={{ height: 160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <Tooltip contentStyle={{ background: '#0a0f1e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function ProgressPage() {
  const { get } = useApiClient();
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get<ProgressData>('/api/progress').then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageShell><div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-xl" />)}</div></PageShell>;
  if (!data) return <PageShell><EmptyState message="Could not load progress data." /></PageShell>;

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl font-bold">Progress</h1>
        <div className="flex gap-4 text-sm">
          <span><span className="font-bold text-cyan-400">{data.currentXP}</span> <span style={{ color: 'hsl(215,20%,65%)' }}>XP</span></span>
          <span><span className="font-bold text-orange-400">{data.currentStreak}</span> <span style={{ color: 'hsl(215,20%,65%)' }}>day streak</span></span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-5">
        <div className="card p-4">
          <h2 className="text-sm font-medium mb-3">ATS Score (30 days)</h2>
          <Chart data={data.atsScores} dataKey="score" color="#06b6d4" label="ATS score" />
        </div>
        <div className="card p-4">
          <h2 className="text-sm font-medium mb-3">Interview Score (30 days)</h2>
          <Chart data={data.interviewScores} dataKey="score" color="#a855f7" label="interview score" />
        </div>
      </div>

      {data.roadmapMilestones.length > 0 && (
        <div className="card p-4">
          <h2 className="text-sm font-medium mb-3">Completed Milestones</h2>
          <div className="space-y-2">
            {data.roadmapMilestones.map((m) => (
              <div key={m.phase} className="flex items-center gap-3 text-sm">
                <span className="text-green-400">✓</span>
                <span className="flex-1">Phase {m.phase}: {m.title}</span>
                <span className="text-xs" style={{ color: 'hsl(215,20%,65%)' }}>{m.completedAt ? new Date(m.completedAt).toLocaleDateString() : ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
