import Link from 'next/link';
interface Props { message: string; ctaHref?: string; ctaLabel?: string; }
export function EmptyState({ message, ctaHref, ctaLabel }: Props) {
  return (
    <div className="card p-10 text-center">
      <div className="w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-xl" style={{ background: 'rgba(6,182,212,0.1)' }}>✨</div>
      <p className="text-sm mb-4" style={{ color: 'hsl(215,20%,65%)' }}>{message}</p>
      {ctaHref && ctaLabel && <Link href={ctaHref} className="btn-primary inline-flex px-5 rounded-lg text-sm">{ctaLabel}</Link>}
    </div>
  );
}
