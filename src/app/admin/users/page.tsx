import { UsersTable } from '@/components/admin/users-table';
import { DemoModeBanner } from '@/components/admin/demo-mode-banner';
import { AccessDenied } from '@/components/admin/access-denied';
import { getAllUsers } from '@/server/user-service';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { requireAdmin, UnauthorizedError } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  if (USE_LIVE_DATABASE) {
    try {
      await requireAdmin();
    } catch (e) {
      if (e instanceof UnauthorizedError) return <AccessDenied message="Only admins can manage users." />;
      throw e;
    }
  }

  const users = await getAllUsers();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Users</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage roles, reputation, and ban malicious accounts.</p>
      {!USE_LIVE_DATABASE && <DemoModeBanner />}
      <UsersTable initialUsers={users} />
    </div>
  );
}
