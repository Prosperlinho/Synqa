import { formatNumber } from '@/lib/utils';
import type { PlatformStats } from '@/types';

export function StatsSection({ stats }: { stats: PlatformStats }) {
  const items = [
    { label: 'Wallets indexed', value: stats.totalWalletsIndexed },
    { label: 'Scam reports', value: stats.totalScamReports },
    { label: 'Verified wallets', value: stats.totalVerifiedWallets },
    { label: 'Community members', value: stats.totalUsers },
    { label: 'Reports this week', value: stats.reportsThisWeek },
    { label: 'Chains supported', value: stats.chainsSupported },
  ];

  return (
    <section className="border-t border-border/70 bg-muted/30">
      <div className="container py-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
        {items.map((item) => (
          <div key={item.label} className="text-center sm:text-left">
            <p className="font-display font-tabular text-2xl md:text-3xl font-semibold tracking-tight">
              {formatNumber(item.value)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
