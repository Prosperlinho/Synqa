import { NextResponse } from 'next/server';
import { requireModeratorOrAdmin, UnauthorizedError } from '@/lib/auth';
import { getAdminDashboardCounts } from '@/server/admin-service';
import { USE_LIVE_DATABASE } from '@/server/data-source';

export async function GET() {
  try {
    if (USE_LIVE_DATABASE) await requireModeratorOrAdmin();
    const counts = await getAdminDashboardCounts();
    return NextResponse.json({ counts });
  } catch (e) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: e.message }, { status: 403 });
    throw e;
  }
}
