import { Badge } from '@/components/ui/badge';
import { CHAINS } from '@/config/chains';
import type { Chain } from '@/types';
import { cn } from '@/lib/utils';

export function ChainBadge({ chain, className }: { chain: Chain; className?: string }) {
  const meta = CHAINS[chain];
  return (
    <Badge variant="outline" className={cn('font-mono text-[11px]', className)}>
      {meta.shortLabel}
    </Badge>
  );
}
