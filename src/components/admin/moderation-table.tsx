'use client';

import * as React from 'react';
import { Check, X, Flag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AddressChip } from '@/components/shared/address-chip';
import { ChainBadge } from '@/components/shared/chain-badge';
import { formatRelativeDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { ScamReportSummary } from '@/types';

export function ModerationTable({ initialReports }: { initialReports: ScamReportSummary[] }) {
  const [reports, setReports] = React.useState(initialReports);
  const [pendingAction, setPendingAction] = React.useState<string | null>(null);

  async function handleAction(reportId: string, action: 'approve' | 'reject' | 'flag-false') {
    setPendingAction(reportId + action);
    try {
      const res = await fetch(`/api/admin/reports/${reportId}/${action}`, { method: 'POST' });
      if (!res.ok) throw new Error();
      setReports((prev) => prev.filter((r) => r.id !== reportId));
      toast.success(
        action === 'approve' ? 'Report approved and now public' : action === 'reject' ? 'Report rejected' : 'Report flagged as false'
      );
    } catch {
      toast.error('Action failed — check admin permissions');
    } finally {
      setPendingAction(null);
    }
  }

  if (reports.length === 0) {
    return <p className="text-sm text-muted-foreground py-12 text-center">No reports in this queue.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reports.map((r) => (
        <Card key={r.id}>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="destructive">{r.category.replace(/_/g, ' ')}</Badge>
              <ChainBadge chain={r.chain} />
              <AddressChip address={r.walletAddress} />
              <span className="text-xs text-muted-foreground ml-auto">{formatRelativeDate(r.createdAt)}</span>
            </div>
            <p className="text-sm text-foreground/90 mb-3">{r.description}</p>
            <div className="flex flex-wrap items-center gap-2">
              {r.websiteUrl && (
                <a href={r.websiteUrl} target="_blank" rel="noreferrer" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
                  Site <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {r.transactionHash && <Badge variant="outline" className="font-mono">{r.transactionHash.slice(0, 12)}…</Badge>}
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="trust" disabled={!!pendingAction} onClick={() => handleAction(r.id, 'approve')}>
                  <Check className="h-3.5 w-3.5" /> Approve
                </Button>
                <Button size="sm" variant="outline" disabled={!!pendingAction} onClick={() => handleAction(r.id, 'reject')}>
                  <X className="h-3.5 w-3.5" /> Reject
                </Button>
                <Button size="sm" variant="destructive" disabled={!!pendingAction} onClick={() => handleAction(r.id, 'flag-false')}>
                  <Flag className="h-3.5 w-3.5" /> Flag false
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
