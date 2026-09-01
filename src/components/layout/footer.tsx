import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { CHAIN_LIST } from '@/config/chains';

export function Footer() {
  return (
    <footer className="border-t border-border/70 mt-24">
      <div className="container py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="font-display font-semibold">Synqa</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Community-verified wallet intelligence. We score what evidence shows —
            never who we assume someone is.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">Product</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/search" className="hover:text-primary">Search wallets</Link></li>
            <li><Link href="/report" className="hover:text-primary">Report a scam</Link></li>
            <li><Link href="/admin" className="hover:text-primary">Admin panel</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">Company</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-primary">About</Link></li>
            <li><Link href="/methodology" className="hover:text-primary">Scoring methodology</Link></li>
            <li><Link href="/legal/terms" className="hover:text-primary">Terms</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-primary">Privacy</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Chains ({CHAIN_LIST.length})
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {CHAIN_LIST.slice(0, 5).map((c) => (
              <li key={c.id}>{c.label}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70">
        <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Synqa. All scores are estimates, not financial or legal advice.</p>
          <p className="font-mono">v1.0.0</p>
        </div>
      </div>
    </footer>
  );
}
