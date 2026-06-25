import Link from 'next/link';
import { Brain, FileText, Mic, Map, Target, TrendingUp, MessageSquare } from 'lucide-react';

const features = [
  { icon: MessageSquare, title: 'AI Chat', desc: 'Career advice powered by Gemini & Groq', href: '/chat' },
  { icon: FileText, title: 'Resume Analysis', desc: 'ATS scoring, JD matching, keyword gaps', href: '/resume' },
  { icon: Mic, title: 'Mock Interviews', desc: 'Practice with AI feedback on every answer', href: '/interview' },
  { icon: Map, title: 'Career Roadmap', desc: 'Step-by-step plans for your target role', href: '/roadmap' },
  { icon: Target, title: 'Skill Gap', desc: 'Know exactly what to learn next', href: '/skill-gap' },
  { icon: TrendingUp, title: 'Progress', desc: 'Charts and streaks to stay motivated', href: '/progress' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'hsl(222,47%,4%)' }}>
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        {/* CSS glow bg */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)' }} />
        </div>

        {/* Pure CSS orb - no Three.js */}
        <div className="relative mb-8" aria-hidden>
          <div className="w-24 h-24 rounded-full mx-auto" style={{
            background: 'conic-gradient(from 0deg, #06b6d4, #a855f7, #06b6d4)',
            boxShadow: '0 0 40px rgba(6,182,212,0.4), 0 0 80px rgba(168,85,247,0.2)',
            animation: 'spin 8s linear infinite',
          }} />
          <Brain className="absolute inset-0 m-auto w-10 h-10 text-white" />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>

        <h1 className="relative text-4xl md:text-6xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, #22d3ee, #818cf8, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Career Copilot
        </h1>
        <p className="relative text-lg max-w-xl mb-8" style={{ color: 'hsl(215,20%,65%)' }}>
          Resume analysis, mock interviews, skill maps and career roadmaps — all in one place.
        </p>
        <div className="relative flex flex-col sm:flex-row gap-3">
          <Link href="/sign-up" className="btn-primary px-8 rounded-xl text-base">Get Started Free</Link>
          <Link href="/sign-in" className="btn-ghost px-8 rounded-xl text-base" style={{ borderColor: 'rgba(6,182,212,0.3)', color: '#22d3ee' }}>Sign In</Link>
        </div>
      </section>

      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">Everything You Need</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, href }) => (
            <Link key={title} href={href} className="card p-5 hover:border-cyan-500/30 transition-colors group block">
              <Icon className="w-6 h-6 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" aria-hidden />
              <h3 className="font-semibold mb-1 text-sm">{title}</h3>
              <p className="text-xs" style={{ color: 'hsl(215,20%,65%)' }}>{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <p className="text-center pb-10 text-xs" style={{ color: 'hsl(215,20%,50%)' }}>
        Powered by Gemini · Groq · MongoDB · Clerk
      </p>
    </div>
  );
}
