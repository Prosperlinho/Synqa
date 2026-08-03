import Link from 'next/link';
import { FileWarning, ArrowUpRight, MessageSquare, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChainBadge } from '@/components/shared/chain-badge';
import { AddressChip } from '@/components/shared/address-chip';
import { formatRelativeDate } from '@/lib/utils';
import type { ScamReportSummary } from '@/types';

const CATEGORY_LABEL: Record<string, string> = {
  PHISHING: 'Phishing',
  RUG_PULL: 'Rug pull',
  FAKE_GIVEAWAY: 'Fake giveaway',
  IMPERSONATION: 'Impersonation',
  ROMANCE_SCAM: 'Romance scam',
  PONZI_SCHEME: 'Ponzi scheme',
  MALICIOUS_CONTRACT: 'Malicious contract',
  ADDRESS_POISONING: 'Address poisoning',
  FAKE_SUPPORT: 'Fake support',
  EXCHANGE_SCAM: 'Exchange scam',
  NFT_SCAM: 'NFT scam',
  OTHER: 'Other',
};

export function LatestReports({ reports }: { reports: ScamReportSummary[] }) {
  return (
    <section className="container py-16 border-t border-border/70">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <FileWarning className="h-4 w-4 text-risk-critical" />
          <h2 className="font-display text-xl font-semibold">Latest scam reports</h2>
        </div>
        <Link href="/report" className="text-sm text-primary inline-flex items-center gap-1 hover:underline">
          Report a scam <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Approved reports, newest first.</p>

      <div className="flex flex-col divide-y divide-border/70 rounded-lg border border-border bg-card">
        {reports.map((r) => (
          <Link key={r.id} href={`/wallet/${r.walletAddress}?chain=${r.chain}`} className="p-4 hover:bg-muted/40 transition-colors">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="destructive">{CATEGORY_LABEL[r.category] ?? r.category}</Badge>
              <ChainBadge chain={r.chain} />
              <AddressChip address={r.walletAddress} />
              <span className="text-xs text-muted-foreground ml-auto">{formatRelativeDate(r.createdAt)}</span>
            </div>
            <p className="text-sm text-foreground/90 line-clamp-2">{r.description}</p>
            <div className="flex items-center gap-4 mt-2.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><ThumbsUp className="h-3.5 w-3.5" /> {r.upvotes}</span>
              <span className="inline-flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {r.commentsCount}</span>
              {r.reporterUsername && <span>reported by {r.reporterUsername}</span>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
