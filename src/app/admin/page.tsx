import { Clock, CheckCircle2, XCircle, Users, Wallet, ShieldAlert } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { DemoModeBanner } from '@/components/admin/demo-mode-banner';
import { AccessDenied } from '@/components/admin/access-denied';
import { getAdminDashboardCounts } from '@/server/admin-service';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { requireModeratorOrAdmin, UnauthorizedError } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  if (USE_LIVE_DATABASE) {
    try {
      await requireModeratorOrAdmin();
    } catch (e) {
      if (e instanceof UnauthorizedError) return <AccessDenied />;
      throw e;
    }
  }

  const counts = await getAdminDashboardCounts();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-6">Platform-wide moderation and growth overview.</p>
      {!USE_LIVE_DATABASE && <DemoModeBanner />}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Pending reports" value={counts.pending} icon={Clock} accentClassName="bg-risk-medium/10 text-risk-medium" />
        <StatCard label="Approved reports" value={counts.approved} icon={CheckCircle2} accentClassName="bg-trust/10 text-trust" />
        <StatCard label="Rejected reports" value={counts.rejected} icon={XCircle} accentClassName="bg-muted text-muted-foreground" />
        <StatCard label="Flagged as false" value={counts.flaggedFalse} icon={ShieldAlert} accentClassName="bg-risk-critical/10 text-risk-critical" />
        <StatCard label="Total users" value={counts.totalUsers} icon={Users} />
        <StatCard label="Wallets indexed" value={counts.totalWallets} icon={Wallet} />
      </div>
    </div>
  );
}
