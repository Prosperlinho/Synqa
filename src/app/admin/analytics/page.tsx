import { AnalyticsCharts } from '@/components/admin/analytics-charts';
import { DemoModeBanner } from '@/components/admin/demo-mode-banner';
import { AccessDenied } from '@/components/admin/access-denied';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { requireModeratorOrAdmin, UnauthorizedError } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  if (USE_LIVE_DATABASE) {
    try {
      await requireModeratorOrAdmin();
    } catch (e) {
      if (e instanceof UnauthorizedError) return <AccessDenied />;
      throw e;
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Analytics</h1>
      <p className="text-sm text-muted-foreground mb-6">Report volume and category trends across the platform.</p>
      {!USE_LIVE_DATABASE && <DemoModeBanner />}
      <AnalyticsCharts />
    </div>
  );
}
