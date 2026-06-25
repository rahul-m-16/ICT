import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'AI Career Copilot', template: '%s | AI Career Copilot' },
  description: 'AI-powered career intelligence: resume analysis, mock interviews, skill gap mapping, and career roadmaps.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body className="min-h-screen antialiased">
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-1 focus:bg-cyan-500 focus:text-black focus:rounded text-sm">
            Skip to main content
          </a>
          <main id="main">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
