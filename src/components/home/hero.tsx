'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { detectLikelyChains } from '@/config/chains';
import { CHAINS } from '@/config/chains';

export function Hero() {
  const router = useRouter();
  const [value, setValue] = React.useState('');
  const likelyChains = React.useMemo(() => detectLikelyChains(value), [value]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <section className="scan-surface relative border-b border-border/70">
      <div className="container py-20 md:py-28 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-6 animate-fade-up">
          <ShieldCheck className="h-3.5 w-3.5 text-trust" />
          Evidence-based wallet reputation — 9 chains, growing
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight max-w-3xl leading-[1.05] animate-fade-up [animation-delay:80ms]">
          Know who you&apos;re sending crypto to
          <span className="text-primary">.</span>
        </h1>
        <p className="mt-5 text-muted-foreground text-base md:text-lg max-w-xl animate-fade-up [animation-delay:160ms]">
          Paste any wallet address to see its risk score, trust score, scam reports,
          and verification status — sourced from moderated community evidence.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 w-full max-w-2xl animate-fade-up [animation-delay:240ms]"
        >
          <div className="relative flex items-center rounded-xl border border-border bg-card shadow-lg shadow-black/5 focus-within:ring-2 focus-within:ring-ring transition-shadow">
            <Search className="ml-4 h-5 w-5 text-muted-foreground shrink-0" />
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Paste any wallet address, ENS name, or entity…"
              className="h-14 border-0 bg-transparent font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <Button type="submit" size="lg" className="m-1.5 shrink-0">
              Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          {value.trim().length > 0 && (
            <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              {likelyChains.length > 0 ? (
                <>
                  <span>Looks like:</span>
                  {likelyChains.map((c) => (
                    <span key={c} className="font-mono text-foreground">{CHAINS[c].label}</span>
                  ))}
                </>
              ) : (
                <span>We&apos;ll search across all 9 supported chains</span>
              )}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
