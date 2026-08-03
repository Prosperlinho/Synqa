import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { RiskBadge } from '@/components/shared/risk-badge';
import { ChainBadge } from '@/components/shared/chain-badge';
import { AddressChip } from '@/components/shared/address-chip';
import type { WalletSummary } from '@/types';

export function TrendingScams({ wallets }: { wallets: WalletSummary[] }) {
  return (
    <section className="container py-16">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-4 w-4 text-risk-high" />
        <h2 className="font-display text-xl font-semibold">Trending scam addresses</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Highest risk-score wallets by recent, moderator-approved report volume.
      </p>

      {wallets.length === 0 ? (
        <Card><CardContent className="p-8 text-sm text-muted-foreground">No high-risk wallets on record right now.</CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {wallets.map((w) => (
            <Link key={w.id} href={`/wallet/${w.address}?chain=${w.chain}`}>
              <Card className="h-full hover:border-risk-high/50 transition-colors group">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <ChainBadge chain={w.chain} />
                    <span className="text-xs text-muted-foreground">{w.scamReportsCount} reports</span>
                  </div>
                  <AddressChip address={w.ens ?? w.address} className="w-fit" />
                  <RiskBadge score={w.riskScore} className="w-fit" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
