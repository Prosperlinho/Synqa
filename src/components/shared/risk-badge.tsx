import { Badge } from '@/components/ui/badge';
import { riskTier, riskTierLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';

const VARIANT_MAP = {
  low: 'riskLow',
  medium: 'riskMedium',
  high: 'riskHigh',
  critical: 'riskCritical',
} as const;

// Written as a static lookup (not template-string interpolation) so Tailwind's
// JIT scanner can see every class name literally and won't purge it.
const DOT_CLASS_MAP = {
  low: 'signal-dot bg-risk-low',
  medium: 'signal-dot bg-risk-medium',
  high: 'signal-dot bg-risk-high',
  critical: 'signal-dot bg-risk-critical',
} as const;

export function RiskBadge({ score, className }: { score: number; className?: string }) {
  const tier = riskTier(score);
  return (
    <Badge variant={VARIANT_MAP[tier]} className={cn('font-tabular', className)}>
      <span className={DOT_CLASS_MAP[tier]} />
      {riskTierLabel(score)} · {score}
    </Badge>
  );
}
