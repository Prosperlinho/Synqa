'use client';

import * as React from 'react';
import { Bookmark, Bell, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddressChip } from '@/components/shared/address-chip';
import { ChainBadge } from '@/components/shared/chain-badge';
import { VerificationBadge } from '@/components/shared/status-badges';
import { CHAINS } from '@/config/chains';
import type { WalletDetail } from '@/types';
import { toast } from 'sonner';

export function WalletHeader({ wallet }: { wallet: WalletDetail }) {
  const [bookmarked, setBookmarked] = React.useState(false);
  const [following, setFollowing] = React.useState(false);

  async function handleBookmark() {
    setBookmarked((v) => !v);
    toast(bookmarked ? 'Removed bookmark' : 'Wallet bookmarked');
    // POST /api/bookmarks in a real session — see src/app/api/bookmarks/route.ts
  }

  async function handleFollow() {
    setFollowing((v) => !v);
    toast(following ? 'Unfollowed wallet' : "You'll be alerted on new reports or score changes");
    // POST /api/follows
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <ChainBadge chain={wallet.chain} />
        <VerificationBadge status={wallet.verificationStatus} />
        {wallet.entityName && (
          <span className="text-sm font-medium text-foreground">{wallet.entityName}</span>
        )}
        {wallet.exchangeName && (
          <span className="text-sm text-muted-foreground">· {wallet.exchangeName}</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-lg sm:text-xl font-medium break-all">
          {wallet.ens ?? wallet.address}
        </h1>
        <AddressChip address={wallet.address} className="text-xs" />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={handleBookmark}>
          <Bookmark className={bookmarked ? 'fill-current' : ''} />
          {bookmarked ? 'Bookmarked' : 'Bookmark'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleFollow}>
          <Bell className={following ? 'fill-current' : ''} />
          {following ? 'Following' : 'Follow for alerts'}
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={CHAINS[wallet.chain].explorerUrl(wallet.address)} target="_blank" rel="noopener noreferrer">
            View on explorer <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </div>
  );
}
