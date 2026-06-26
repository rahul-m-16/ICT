'use client';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Brain } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-14 flex items-center px-4 border-b" style={{ background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.06)' }}>
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
        <Brain className="w-5 h-5" aria-hidden />
        <span className="hidden sm:inline">AI Career Copilot</span>
      </Link>
      <div className="ml-auto"><UserButton afterSignOutUrl="/" /></div>
    </header>
  );
}
