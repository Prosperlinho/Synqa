import { ArrowDownLeft, ArrowUpRight, FileCode } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddressChip } from '@/components/shared/address-chip';
import { formatCompactUsd, formatRelativeDate } from '@/lib/utils';
import type { WalletActivity } from '@/types';

const DIRECTION_META = {
  IN: { icon: ArrowDownLeft, className: 'text-trust bg-trust/10' },
  OUT: { icon: ArrowUpRight, className: 'text-risk-medium bg-risk-medium/10' },
  CONTRACT_CALL: { icon: FileCode, className: 'text-muted-foreground bg-muted' },
};

export function ActivityFeed({ activity }: { activity: WalletActivity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No recent transactions indexed.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border/70">
            {activity.map((a) => {
              const meta = DIRECTION_META[a.direction];
              const Icon = meta.icon;
              return (
                <div key={a.id} className="flex items-center gap-3 py-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${meta.className}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{a.direction === 'IN' ? 'Received' : a.direction === 'OUT' ? 'Sent' : 'Contract call'}</span>
                      {a.counterparty && <AddressChip address={a.counterparty} />}
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">{a.txHash}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {a.valueUsd != null && <p className="text-sm font-tabular">{formatCompactUsd(a.valueUsd)}</p>}
                    <p className="text-xs text-muted-foreground">{formatRelativeDate(a.occurredAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
