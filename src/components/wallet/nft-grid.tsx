import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageOff } from 'lucide-react';
import { formatCompactUsd } from '@/lib/utils';
import type { NftHolding } from '@/types';

export function NftGrid({ nfts }: { nfts: NftHolding[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">NFT holdings</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {nfts.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No NFT holdings indexed for this wallet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {nfts.map((n) => (
              <div key={n.id} className="rounded-lg border border-border overflow-hidden">
                <div className="aspect-square bg-muted flex items-center justify-center">
                  <ImageOff className="h-6 w-6 text-muted-foreground/40" />
                </div>
                <div className="p-2.5">
                  <p className="text-xs font-medium truncate">{n.collection}</p>
                  <p className="text-xs text-muted-foreground">{n.tokenId}</p>
                  {n.floorPriceUsd != null && (
                    <p className="text-xs font-tabular text-muted-foreground mt-0.5">
                      Floor {formatCompactUsd(n.floorPriceUsd)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
