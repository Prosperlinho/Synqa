import { NextResponse, type NextRequest } from 'next/server';
import { requireModeratorOrAdmin, UnauthorizedError } from '@/lib/auth';
import { flagFalseReport } from '@/server/admin-service';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { moderationDecisionSchema } from '@/lib/validation';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = USE_LIVE_DATABASE ? await requireModeratorOrAdmin() : { id: 'demo-admin' };
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const parsed = moderationDecisionSchema.safeParse({ reportId: id, ...body });
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

    const result = await flagFalseReport(parsed.data.reportId, actor.id, parsed.data.note);
    return NextResponse.json({ report: result });
  } catch (e) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: e.message }, { status: 403 });
    throw e;
  }
}
