import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { RiskBadge } from '@/components/shared/risk-badge';
import { TrustBadge } from '@/components/shared/status-badges';
import { VerificationBadge } from '@/components/shared/status-badges';
import { ChainBadge } from '@/components/shared/chain-badge';
import { AddressChip } from '@/components/shared/address-chip';
import type { WalletSummary } from '@/types';

export function WalletResultRow({ wallet }: { wallet: WalletSummary }) {
  return (
    <Link href={`/wallet/${wallet.address}?chain=${wallet.chain}`}>
      <Card className="hover:border-primary/50 transition-colors">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <ChainBadge chain={wallet.chain} />
            <div className="min-w-0">
              <AddressChip address={wallet.ens ?? wallet.address} />
              {wallet.entityName && <p className="text-xs text-muted-foreground mt-1">{wallet.entityName}{wallet.exchangeName ? ` · ${wallet.exchangeName}` : ''}</p>}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <VerificationBadge status={wallet.verificationStatus} />
            <RiskBadge score={wallet.riskScore} />
            <TrustBadge score={wallet.trustScore} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
