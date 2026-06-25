'use client';
import { useEffect, useState } from 'react';
import PageShell from '@/components/layout/PageShell';
import { useApiClient } from '@/lib/api';

export default function ProfilePage() {
  const { get, patch } = useApiClient();
  const [form, setForm] = useState({ displayName: '', targetRole: '', yearsOfExperience: 0, professionalSummary: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    get<{ profile: typeof form }>('/api/profile').then((r) => setForm(r.profile)).catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try { await patch('/api/profile', form); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    catch { /* ignore */ } finally { setSaving(false); }
  };

  return (
    <PageShell>
      <h1 className="text-xl font-bold mb-5">Profile</h1>
      <form onSubmit={handleSave} className="card p-5 max-w-lg space-y-4">
        {[
          { id: 'name', label: 'Display Name', value: form.displayName, key: 'displayName', type: 'text' },
          { id: 'role', label: 'Target Role', value: form.targetRole, key: 'targetRole', type: 'text' },
          { id: 'yoe', label: 'Years of Experience', value: form.yearsOfExperience, key: 'yearsOfExperience', type: 'number' },
        ].map(({ id, label, value, key, type }) => (
          <div key={id}>
            <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
            <input id={id} type={type} value={value} onChange={(e) => setForm((f) => ({ ...f, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
              className="input rounded-lg" />
          </div>
        ))}
        <div>
          <label htmlFor="summary" className="block text-sm font-medium mb-1">Professional Summary</label>
          <textarea id="summary" rows={4} value={form.professionalSummary}
            onChange={(e) => setForm((f) => ({ ...f, professionalSummary: e.target.value }))}
            className="input rounded-lg resize-none" />
        </div>
        <button type="submit" disabled={saving} className="btn-primary rounded-xl w-full">
          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Profile'}
        </button>
      </form>
    </PageShell>
  );
}
