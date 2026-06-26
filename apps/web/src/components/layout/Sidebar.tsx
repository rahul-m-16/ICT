'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, MessageSquare, FileText, Mic2, Map, Target, TrendingUp, User, Settings } from 'lucide-react';

const nav = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { href: '/resume', icon: FileText, label: 'Resume' },
  { href: '/interview', icon: Mic2, label: 'Interview' },
  { href: '/roadmap', icon: Map, label: 'Roadmap' },
  { href: '/skill-gap', icon: Target, label: 'Skill Gap' },
  { href: '/progress', icon: TrendingUp, label: 'Progress' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed left-0 top-14 bottom-0 w-52 hidden md:flex flex-col border-r overflow-y-auto z-30" style={{ background: 'rgba(10,15,30,0.7)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <nav className="p-2 flex flex-col gap-0.5" aria-label="Main navigation">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} prefetch={true}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
              style={active
                ? { background: 'rgba(6,182,212,0.15)', color: '#22d3ee', fontWeight: 500 }
                : { color: 'hsl(215,20%,65%)' }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'hsl(210,40%,98%)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'hsl(215,20%,65%)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <Icon className="w-4 h-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
