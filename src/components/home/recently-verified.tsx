import Link from 'next/link';
import { BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { TrustBadge } from '@/components/shared/status-badges';
import { ChainBadge } from '@/components/shared/chain-badge';
import { AddressChip } from '@/components/shared/address-chip';
import type { WalletSummary } from '@/types';

export function RecentlyVerified({ wallets }: { wallets: WalletSummary[] }) {
  return (
    <section className="container py-16 border-t border-border/70">
      <div className="flex items-center gap-2 mb-1">
        <BadgeCheck className="h-4 w-4 text-verified" />
        <h2 className="font-display text-xl font-semibold">Recently verified wallets</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Entities and exchanges confirmed by Synqa or the community.
      </p>

      {wallets.length === 0 ? (
        <Card><CardContent className="p-8 text-sm text-muted-foreground">No verified wallets yet.</CardContent></Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {wallets.map((w) => (
            <Link key={w.id} href={`/wallet/${w.address}?chain=${w.chain}`}>
              <Card className="h-full hover:border-verified/50 transition-colors">
                <CardContent className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <ChainBadge chain={w.chain} />
                    {w.entityName && <span className="text-xs font-medium">{w.entityName}</span>}
                  </div>
                  <AddressChip address={w.ens ?? w.address} className="w-fit" />
                  <TrustBadge score={w.trustScore} className="w-fit" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
