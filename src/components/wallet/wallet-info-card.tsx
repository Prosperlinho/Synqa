import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChainBadge } from '@/components/shared/chain-badge';
import { formatRelativeDate, formatNumber } from '@/lib/utils';
import type { WalletDetail } from '@/types';

const WALLET_TYPE_LABEL: Record<string, string> = {
  PERSONAL: 'Personal wallet',
  CONTRACT: 'Smart contract',
  EXCHANGE: 'Exchange wallet',
  BRIDGE: 'Bridge contract',
  MIXER: 'Mixing service',
  CONTRACT_PROXY: 'Proxy contract',
  MULTISIG: 'Multisig wallet',
  UNKNOWN: 'Unknown',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 hairline text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{children}</span>
    </div>
  );
}

export function WalletInfoCard({ wallet }: { wallet: WalletDetail }) {
  const isUnknownOwner = !wallet.entityName && !wallet.exchangeName && wallet.walletType === 'UNKNOWN';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Wallet information</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Field label="Blockchain"><ChainBadge chain={wallet.chain} /></Field>
        <Field label="Wallet type">{WALLET_TYPE_LABEL[wallet.walletType]}</Field>
        <Field label="Contract or personal">{wallet.isContract ? 'Contract' : 'Personal wallet'}</Field>
        <Field label="Entity">{wallet.entityName ?? '—'}</Field>
        <Field label="Exchange name">{wallet.exchangeName ?? '—'}</Field>
        <Field label="Date first seen">{wallet.firstSeenAt ? new Date(wallet.firstSeenAt).toLocaleDateString() : 'Unknown'}</Field>
        <Field label="Recent activity">{formatRelativeDate(wallet.lastActiveAt)}</Field>
        <Field label="Transaction count">{formatNumber(wallet.txCount)}</Field>
        <Field label="Token holdings">{wallet.tokenHoldingsCount}</Field>
        <Field label="NFT holdings">{wallet.nftHoldingsCount}</Field>
        <div className="py-2.5 flex items-start justify-between text-sm">
          <span className="text-muted-foreground">Connected chains</span>
          <div className="flex flex-wrap gap-1.5 justify-end max-w-[65%]">
            {wallet.connectedChains.map((c) => (
              <ChainBadge key={c} chain={c} />
            ))}
          </div>
        </div>

        {wallet.labels.length > 0 && (
          <div className="pt-3">
            <p className="text-xs text-muted-foreground mb-2">Known labels</p>
            <div className="flex flex-wrap gap-1.5">
              {wallet.labels.map((l) => (
                <Badge key={l.id} variant="outline">{l.label}</Badge>
              ))}
            </div>
          </div>
        )}

        {isUnknownOwner && (
          <p className="mt-4 rounded-md bg-muted/60 p-3 text-xs text-muted-foreground leading-relaxed">
            No known public owner found. Synqa does not infer or guess the identity
            of private wallet owners — this address has no verified entity on record.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
