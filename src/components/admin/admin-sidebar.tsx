'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileWarning,
  Users,
  Tag,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/reports', label: 'Reports', icon: FileWarning },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/labels', label: 'Wallet labels', icon: Tag },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-56 shrink-0 border-b lg:border-b-0 lg:border-r border-border/70 lg:h-[calc(100vh-4rem)] lg:sticky lg:top-16 py-6">
      <div className="flex items-center gap-2 px-4 mb-6">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <span className="font-display text-sm font-semibold">Admin panel</span>
      </div>
      <nav className="flex lg:flex-col gap-1 px-2 overflow-x-auto">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap transition-colors',
                active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
