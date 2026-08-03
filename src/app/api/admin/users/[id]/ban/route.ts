import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin, UnauthorizedError } from '@/lib/auth';
import { banUser } from '@/server/admin-service';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { banUserSchema } from '@/lib/validation';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const actor = USE_LIVE_DATABASE ? await requireAdmin() : { id: 'demo-admin' };
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const parsed = banUserSchema.safeParse({ userId: id, ...body });
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });

    const result = await banUser(parsed.data.userId, actor.id, parsed.data.reason);
    return NextResponse.json({ user: result });
  } catch (e) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: e.message }, { status: 403 });
    throw e;
  }
}
