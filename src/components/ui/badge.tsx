import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary/10 text-primary',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
        destructive: 'border-transparent bg-destructive/10 text-destructive',
        trust: 'border-transparent bg-trust/10 text-trust',
        riskLow: 'border-transparent bg-risk-low/10 text-risk-low',
        riskMedium: 'border-transparent bg-risk-medium/10 text-risk-medium',
        riskHigh: 'border-transparent bg-risk-high/10 text-risk-high',
        riskCritical: 'border-transparent bg-risk-critical/10 text-risk-critical',
        verified: 'border-transparent bg-verified/10 text-verified',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
