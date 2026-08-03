import { AdminSidebar } from '@/components/admin/admin-sidebar';

/**
 * Route-level gating happens per-page via requireAdmin()/requireModeratorOrAdmin()
 * in each server component below, so unauthorized users get a clear 403 rather
 * than a silently empty shell. The layout only renders navigation chrome.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container flex flex-col lg:flex-row gap-8 py-0">
      <AdminSidebar />
      <div className="flex-1 min-w-0 py-8">{children}</div>
    </div>
  );
}
