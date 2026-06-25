'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageShell from '@/components/layout/PageShell';
import { useApiClient } from '@/lib/api';

export default function SettingsPage() {
  const { get, patch, del } = useApiClient();
  const router = useRouter();
  const [settings, setSettings] = useState({ voiceOutputEnabled: false, aiVerbosity: 'concise' as 'concise' | 'detailed' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    get<{ profile: { settings: typeof settings } }>('/api/profile').then((r) => {
      if (r.profile.settings) setSettings(r.profile.settings);
    }).catch(() => {});
  }, []);

  const save = async () => {
    setSaving(true);
    try { await patch('/api/settings', settings); } catch { /* ignore */ } finally { setSaving(false); }
  };

  const deleteAccount = async () => {
    try { await del('/api/account'); router.push('/'); } catch { /* ignore */ }
  };

  return (
    <PageShell>
      <h1 className="text-xl font-bold mb-5">Settings</h1>
      <div className="card p-5 max-w-md space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Voice Output</p>
            <p className="text-xs" style={{ color: 'hsl(215,20%,65%)' }}>Read AI responses aloud</p>
          </div>
          <button onClick={() => setSettings((s) => ({ ...s, voiceOutputEnabled: !s.voiceOutputEnabled }))}
            className="w-11 h-6 rounded-full transition-colors relative"
            style={{ background: settings.voiceOutputEnabled ? '#06b6d4' : 'rgba(255,255,255,0.1)' }}
            aria-checked={settings.voiceOutputEnabled} role="switch">
            <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
              style={{ left: settings.voiceOutputEnabled ? '22px' : '2px' }} />
          </button>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">AI Verbosity</p>
          <div className="flex gap-2">
            {(['concise', 'detailed'] as const).map((v) => (
              <button key={v} onClick={() => setSettings((s) => ({ ...s, aiVerbosity: v }))}
                className="flex-1 py-2 rounded-lg text-sm border capitalize transition-colors"
                style={settings.aiVerbosity === v ? { borderColor: '#06b6d4', background: 'rgba(6,182,212,0.1)', color: '#22d3ee' } : { borderColor: 'rgba(255,255,255,0.1)', color: 'hsl(215,20%,65%)' }}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <button onClick={save} disabled={saving} className="btn-primary w-full rounded-xl">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>

        <div className="border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)} className="text-sm text-red-400 hover:text-red-300 transition-colors">Delete Account…</button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-red-400">This cannot be undone. Are you sure?</p>
              <div className="flex gap-2">
                <button onClick={deleteAccount} className="flex-1 py-2 rounded-lg text-sm text-red-400" style={{ background: 'rgba(248,113,113,0.1)' }}>Delete Forever</button>
                <button onClick={() => setDeleteConfirm(false)} className="btn-ghost flex-1 rounded-lg text-sm">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
