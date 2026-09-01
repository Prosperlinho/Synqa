'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search, FlagTriangleRight, LayoutDashboard, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { ConnectWalletButton } from '@/components/layout/connect-wallet-button';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/search', label: 'Search', icon: Search },
  { href: '/report', label: 'Report a scam', icon: FlagTriangleRight },
  { href: '/admin', label: 'Admin', icon: LayoutDashboard },
];

export function Navbar() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <ShieldCheck className="h-4.5 w-4.5 text-primary" strokeWidth={2.25} />
          </div>
          <span className="font-display text-[15px] font-semibold tracking-tight">
            Synqa
          </span>
        </Link>

        <form onSubmit={handleQuickSearch} className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste any wallet address, ENS, or entity…"
            className="pl-9 h-9 font-mono text-xs bg-muted/50"
          />
        </form>

        <nav className="hidden md:flex items-center gap-1 ml-auto">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <Link href={link.href}>
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ConnectWalletButton />
          <ThemeToggle />
        </div>

        <button
          className="md:hidden ml-auto p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          'md:hidden overflow-hidden border-t border-border/70 transition-[max-height] duration-300',
          mobileOpen ? 'max-h-96' : 'max-h-0'
        )}
      >
        <div className="container py-4 flex flex-col gap-3">
          <form onSubmit={handleQuickSearch} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Paste a wallet address…"
              className="pl-9 h-9 font-mono text-xs"
            />
          </form>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-sm py-2"
              onClick={() => setMobileOpen(false)}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2">
            <ConnectWalletButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
