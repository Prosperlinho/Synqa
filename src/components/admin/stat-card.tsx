import { Card, CardContent } from '@/components/ui/card';
import { formatNumber, cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export function StatCard({
  label,
  value,
  icon: Icon,
  accentClassName,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  accentClassName?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-display font-tabular text-2xl font-semibold mt-1">{formatNumber(value)}</p>
        </div>
        <div className={cn('h-10 w-10 rounded-md flex items-center justify-center', accentClassName ?? 'bg-primary/10 text-primary')}>
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
