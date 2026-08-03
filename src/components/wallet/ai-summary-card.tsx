import { Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AiRiskSummary } from '@/types';

const CONFIDENCE_LABEL: Record<AiRiskSummary['confidence'], string> = {
  low: 'Low confidence',
  medium: 'Medium confidence',
  high: 'High confidence',
};

export function AiSummaryCard({ summary }: { summary: AiRiskSummary }) {
  return (
    <Card className="border-primary/20 bg-primary/[0.03]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Risk Analysis
          </CardTitle>
          <Badge variant="outline">{CONFIDENCE_LABEL[summary.confidence]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="font-medium mb-1.5">{summary.headline}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{summary.body}</p>
        <p className="text-xs text-muted-foreground mt-3">
          Based on {summary.basedOnReports} moderator-approved report{summary.basedOnReports === 1 ? '' : 's'}.
          Never an assumption of identity or intent beyond recorded evidence.
        </p>
      </CardContent>
    </Card>
  );
}
