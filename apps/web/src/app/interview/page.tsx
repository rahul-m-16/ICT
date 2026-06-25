'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageShell from '@/components/layout/PageShell';
import { useApiClient } from '@/lib/api';
import type { InterviewSession } from '@/types';

export default function InterviewSetupPage() {
  const { post } = useApiClient();
  const router = useRouter();
  const [form, setForm] = useState({ targetRole: '', interviewType: 'Mixed', difficulty: 'Medium' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await post<{ session: InterviewSession }>('/api/interview/session', form);
      router.push(`/interview/session/${res.session._id}`);
    } catch (e) { setError((e as Error).message); setLoading(false); }
  };

  return (
    <PageShell>
      <h1 className="text-xl font-bold mb-5">Mock Interview</h1>
      <div className="max-w-md">
        <form onSubmit={handleStart} className="card p-5 space-y-4">
          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">Target Role</label>
            <input id="role" required placeholder="e.g. Frontend Engineer"
              className="input rounded-lg" value={form.targetRole}
              onChange={(e) => setForm((f) => ({ ...f, targetRole: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Interview Type</label>
            <div className="flex gap-2">
              {['Behavioral', 'Technical', 'Mixed'].map((t) => (
                <button key={t} type="button" onClick={() => setForm((f) => ({ ...f, interviewType: t }))}
                  className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${form.interviewType === t ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <div className="flex gap-2">
              {['Easy', 'Medium', 'Hard'].map((d) => (
                <button key={d} type="button" onClick={() => setForm((f) => ({ ...f, difficulty: d }))}
                  className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${form.difficulty === d ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-white/10 text-gray-400 hover:border-white/20'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading || !form.targetRole.trim()} className="btn-primary w-full rounded-xl">
            {loading ? 'Generating questions…' : 'Start Interview'}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
