import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'hsl(222,47%,4%)' }}>
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6" style={{ background: 'linear-gradient(135deg,#22d3ee,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Create your account
        </h1>
        <SignUp
          appearance={{ elements: {
            card: 'bg-white/5 border border-white/10 rounded-xl shadow-none',
            formButtonPrimary: 'bg-cyan-500 hover:bg-cyan-400 text-black',
            formFieldInput: 'bg-white/5 border-white/10 text-white',
            footerActionLink: 'text-cyan-400',
          }}}
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
