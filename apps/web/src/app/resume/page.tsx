'use client';
import { useState, useRef, useEffect } from 'react';
import PageShell from '@/components/layout/PageShell';
import { useApiClient } from '@/lib/api';
import { Upload, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/ui/empty-state';

interface ResumeDoc { _id: string; uploadedAt: string; isActive: boolean; parsed: { contact: Record<string,string>; skills: string[]; summary: string }; cloudinaryUrl: string; }

export default function ResumePage() {
  const { postForm, get } = useApiClient();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [active, setActive] = useState<ResumeDoc | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    get<{ resumes: ResumeDoc[] }>('/api/resume').then((r) => {
      setActive(r.resumes.find((x) => x.isActive) ?? null);
    }).catch(() => {});
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true); setError('');
    try {
      const form = new FormData(); form.append('resume', file);
      const res = await postForm<{ resume: ResumeDoc }>('/api/resume/upload', form);
      setActive(res.resume);
    } catch (e) { setError((e as Error).message); }
    finally { setUploading(false); }
  };

  return (
    <PageShell>
      <h1 className="text-xl font-bold mb-5">Resume</h1>

      <div className="card p-5 mb-5">
        <input ref={fileRef} type="file" accept=".pdf" className="sr-only" onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-primary rounded-xl gap-2 w-full sm:w-auto">
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading & parsing…' : active ? 'Replace Resume' : 'Upload PDF Resume'}
        </button>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {active ? (
        <div className="card p-5 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">Active Resume</span>
            <span className="text-xs ml-auto" style={{ color: 'hsl(215,20%,65%)' }}>{new Date(active.uploadedAt).toLocaleDateString()}</span>
          </div>
          {active.parsed.contact?.name && <p className="font-semibold mb-1">{active.parsed.contact.name}</p>}
          {active.parsed.summary && <p className="text-sm mb-3 line-clamp-2" style={{ color: 'hsl(215,20%,65%)' }}>{active.parsed.summary}</p>}
          {active.parsed.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {active.parsed.skills.slice(0, 12).map((s) => <span key={s} className="tag-green">{s}</span>)}
              {active.parsed.skills.length > 12 && <span className="text-xs" style={{ color: 'hsl(215,20%,65%)' }}>+{active.parsed.skills.length - 12} more</span>}
            </div>
          )}
        </div>
      ) : !uploading ? (
        <EmptyState message="No resume uploaded yet. Upload a PDF to get started." />
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { href: '/resume/ats', label: 'ATS Analysis', desc: 'Check your ATS score' },
          { href: '/resume/jd-match', label: 'JD Matching', desc: 'Match against job descriptions' },
        ].map(({ href, label, desc }) => (
          <Link key={href} href={href} className="card p-4 flex items-center gap-3 hover:border-cyan-500/30 transition-colors group">
            <FileText className="w-5 h-5 text-cyan-400" />
            <div className="flex-1">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs" style={{ color: 'hsl(215,20%,65%)' }}>{desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
