import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { getCurrentUser } from '@/lib/auth';
import { voteSchema } from '@/lib/validation';
import { checkRateLimit, voteLimiter, getClientIdentifier } from '@/lib/rate-limit';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const identifier = getClientIdentifier(request);
  const { success } = await checkRateLimit(voteLimiter, identifier, 30, 60_000);
  if (!success) return NextResponse.json({ error: 'Too many votes. Slow down.' }, { status: 429 });

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in to vote' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = voteSchema.safeParse({ ...body, reportId: id });
  if (!parsed.success) return NextResponse.json({ error: 'Invalid vote' }, { status: 400 });

  if (!USE_LIVE_DATABASE) {
    return NextResponse.json({ ok: true, demo: true });
  }

  await prisma.vote.upsert({
    where: { reportId_userId: { reportId: parsed.data.reportId, userId: user.id } },
    update: { value: parsed.data.value },
    create: { reportId: parsed.data.reportId, userId: user.id, value: parsed.data.value },
  });

  return NextResponse.json({ ok: true });
}
