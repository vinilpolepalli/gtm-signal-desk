import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GTM Signal Desk: inbound signals to approved rep actions',
  description: 'Independent demo: a fictional revenue pipeline where inbound account signals are triaged into drafted rep actions with rule-based priorities and an approval queue. Sample accounts are fictional; not affiliated with Nex.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body className="min-h-screen font-sans antialiased">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-4">
          <Link href="/" className="text-base font-semibold text-ink">GTM Signal Desk <span className="font-normal text-mute">independent demo</span></Link>
          <nav className="flex gap-5 text-sm"><Link className="text-ink hover:text-accent" href="/">Action queue</Link></nav>
        </header>
        {children}
        <footer className="mt-12 border-t border-line py-5 text-xs leading-relaxed text-mute">
          Demo built by Vinil Polepalli. The accounts and signals are fictional sample data; priorities come from explicit rules with every point listed, not from machine learning. Approvals, snoozes and dismissals are stored in this demo's database under an anonymous browser cookie. Independent demo; not affiliated with or endorsed by Nex.
        </footer>
      </div>
    </body></html>
  );
}
