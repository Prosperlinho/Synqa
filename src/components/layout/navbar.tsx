'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search, FlagTriangleRight, LayoutDashboard, UserRound, LogIn, UserPlus, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { ConnectWalletButton } from '@/components/layout/connect-wallet-button';
import { cn } from '@/lib/utils';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { SessionUser } from '@/lib/auth';

const NAV_LINKS = [
  { href: '/search', label: 'Search', icon: Search },
  { href: '/report', label: 'Report a scam', icon: FlagTriangleRight },
  { href: '/admin', label: 'Admin', icon: LayoutDashboard },
];

export function Navbar({
  canAccessAdmin,
  currentUser,
}: {
  canAccessAdmin: boolean;
  currentUser: Pick<SessionUser, 'username' | 'email'> | null;
}) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [signedIn, setSignedIn] = React.useState(Boolean(currentUser));

  React.useEffect(() => {
    let supabase: ReturnType<typeof createSupabaseBrowserClient>;
    try {
      supabase = createSupabaseBrowserClient();
    } catch {
      return;
    }

    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(Boolean(session?.user));
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  function handleQuickSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  async function handleLogout() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
      setSignedIn(false);
      setMobileOpen(false);
      router.refresh();
    } catch {
      setSignedIn(false);
    }
  }

  const visibleNavLinks = NAV_LINKS.filter((link) => link.href !== '/admin' || canAccessAdmin);

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
          {visibleNavLinks.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <Link href={link.href}>
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
          {signedIn && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/account">
                <UserRound className="h-4 w-4" />
                Account
              </Link>
            </Button>
          )}
          {!signedIn ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">
                  <LogIn className="h-4 w-4" />
                  Log in
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/auth/register">
                  <UserPlus className="h-4 w-4" />
                  Sign up
                </Link>
              </Button>
            </>
          ) : (
            <>
              <span className="max-w-36 truncate text-xs text-muted-foreground" title={currentUser?.email}>
                {currentUser?.username || currentUser?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </>
          )}
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
          {visibleNavLinks.map((link) => (
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
          {signedIn && (
            <Link href="/account" className="flex items-center gap-2 text-sm py-2" onClick={() => setMobileOpen(false)}>
              <UserRound className="h-4 w-4" />
              Account
            </Link>
          )}
          {!signedIn ? (
            <>
              <Link href="/auth/login" className="flex items-center gap-2 text-sm py-2" onClick={() => setMobileOpen(false)}>
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
              <Link href="/auth/register" className="flex items-center gap-2 text-sm py-2" onClick={() => setMobileOpen(false)}>
                <UserPlus className="h-4 w-4" />
                Sign up
              </Link>
            </>
          ) : (
            <button type="button" className="flex items-center gap-2 text-sm py-2 text-left" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Log out ({currentUser?.username || currentUser?.email})
            </button>
          )}
          <div className="flex items-center gap-2 pt-2">
            <ConnectWalletButton />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
