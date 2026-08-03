import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ModerationTable } from '@/components/admin/moderation-table';
import { DemoModeBanner } from '@/components/admin/demo-mode-banner';
import { AccessDenied } from '@/components/admin/access-denied';
import { getPendingReports, getLatestApprovedReports } from '@/server/report-service';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { requireModeratorOrAdmin, UnauthorizedError } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminReportsPage() {
  if (USE_LIVE_DATABASE) {
    try {
      await requireModeratorOrAdmin();
    } catch (e) {
      if (e instanceof UnauthorizedError) return <AccessDenied />;
      throw e;
    }
  }

  const [pending, approved] = await Promise.all([getPendingReports(), getLatestApprovedReports(20)]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Scam reports</h1>
      <p className="text-sm text-muted-foreground mb-6">Review evidence and moderate submissions before they go public.</p>
      {!USE_LIVE_DATABASE && <DemoModeBanner />}

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value="pending"><ModerationTable initialReports={pending as any} /></TabsContent>
        <TabsContent value="approved"><ModerationTable initialReports={approved as any} /></TabsContent>
        <TabsContent value="rejected">
          <p className="text-sm text-muted-foreground py-12 text-center">Rejected reports are retained for audit but hidden from public view.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
