import { BadgeCheck, ShieldAlert, HelpCircle, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { VerificationStatus } from '@/types';

export function TrustBadge({ score, className }: { score: number; className?: string }) {
  return (
    <Badge variant="trust" className={cn('font-tabular', className)}>
      <span className="signal-dot bg-trust" />
      Trust {score}
    </Badge>
  );
}

const VERIFICATION_META: Record<
  VerificationStatus,
  { label: string; icon: typeof BadgeCheck; className: string }
> = {
  OFFICIALLY_VERIFIED: { label: 'Officially verified', icon: BadgeCheck, className: 'bg-verified/10 text-verified border-transparent' },
  COMMUNITY_VERIFIED: { label: 'Community verified', icon: Users, className: 'bg-trust/10 text-trust border-transparent' },
  UNVERIFIED: { label: 'Unverified', icon: HelpCircle, className: 'bg-muted text-muted-foreground border-transparent' },
  FLAGGED_SCAM: { label: 'Flagged as scam', icon: ShieldAlert, className: 'bg-risk-critical/10 text-risk-critical border-transparent' },
};

export function VerificationBadge({ status, className }: { status: VerificationStatus; className?: string }) {
  const meta = VERIFICATION_META[status];
  const Icon = meta.icon;
  return (
    <Badge className={cn(meta.className, className)}>
      <Icon className="h-3 w-3" />
      {meta.label}
    </Badge>
  );
}
