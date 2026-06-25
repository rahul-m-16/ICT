'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import PageShell from '@/components/layout/PageShell';
import MetricCard from '@/components/dashboard/MetricCard';
import { useApiClient } from '@/lib/api';
import type { DashboardMetrics } from '@/types';

const RecommendationList = dynamic(() => import('@/components/dashboard/RecommendationList'));

export default function DashboardPage() {
  const { get } = useApiClient();
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get<DashboardMetrics>('/api/dashboard').then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PageShell>
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-white/5 rounded w-32" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-white/5 rounded-xl" />)}
        </div>
        <div className="h-40 bg-white/5 rounded-xl" />
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <h1 className="text-xl font-bold mb-5">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MetricCard label="ATS Score" value={data?.latestATSScore ?? null} unit="/100" />
        <MetricCard label="Interviews Done" value={data?.completedInterviews ?? 0} />
        <MetricCard label="Roadmap" value={data?.roadmapCompletion != null ? `${data.roadmapCompletion}%` : null} />
        <MetricCard label={`XP · ${data?.streak ?? 0}d streak`} value={data?.currentXP ?? 0} unit="xp" />
      </div>
      {data?.recommendations?.length ? (
        <>
          <h2 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'hsl(215,20%,65%)' }}>
            Recommendations
          </h2>
          <RecommendationList items={data.recommendations} />
        </>
      ) : null}
    </PageShell>
  );
}
