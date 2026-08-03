'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VoteButtons } from '@/components/reports/vote-buttons';
import { CommentSection } from '@/components/reports/comment-section';
import { formatRelativeDate } from '@/lib/utils';
import { ExternalLink, MessageSquare, ChevronDown } from 'lucide-react';
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

export function ReportCard({ report }: { report: ScamReportSummary }) {
  const [showComments, setShowComments] = React.useState(false);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="destructive">{CATEGORY_LABEL[report.category] ?? report.category}</Badge>
          {report.status === 'PENDING' && <Badge variant="secondary">Pending review</Badge>}
          <span className="text-xs text-muted-foreground ml-auto">
            {report.incidentDate ? `Incident ${new Date(report.incidentDate).toLocaleDateString()}` : formatRelativeDate(report.createdAt)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm leading-relaxed">{report.description}</p>

        <div className="flex flex-wrap gap-2 mt-3">
          {report.transactionHash && (
            <Badge variant="outline" className="font-mono">tx: {report.transactionHash.slice(0, 10)}…</Badge>
          )}
          {report.websiteUrl && (
            <a href={report.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
              Reported site <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {report.socialMediaUrl && (
            <a href={report.socialMediaUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary inline-flex items-center gap-1 hover:underline">
              Social profile <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <VoteButtons reportId={report.id} initialUpvotes={report.upvotes} initialDownvotes={report.downvotes} />
          <Button variant="ghost" size="sm" onClick={() => setShowComments((v) => !v)}>
            <MessageSquare className="h-3.5 w-3.5" /> {report.commentsCount} comments
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showComments ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-border/70">
            <CommentSection reportId={report.id} />
          </div>
        )}

        {report.reporterUsername && (
          <p className="text-xs text-muted-foreground mt-3">Reported by {report.reporterUsername}</p>
        )}
      </CardContent>
    </Card>
  );
}
