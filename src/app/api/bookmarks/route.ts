import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const schema = z.object({ walletId: z.string(), note: z.string().max(280).optional() });

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in to bookmark wallets' }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  if (!USE_LIVE_DATABASE) return NextResponse.json({ ok: true, demo: true });

  const bookmark = await prisma.bookmark.upsert({
    where: { userId_walletId: { userId: user.id, walletId: parsed.data.walletId } },
    update: { note: parsed.data.note },
    create: { userId: user.id, walletId: parsed.data.walletId, note: parsed.data.note },
  });

  return NextResponse.json({ bookmark });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const parsed = schema.pick({ walletId: true }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  if (!USE_LIVE_DATABASE) return NextResponse.json({ ok: true, demo: true });

  await prisma.bookmark.delete({
    where: { userId_walletId: { userId: user.id, walletId: parsed.data.walletId } },
  });

  return NextResponse.json({ ok: true });
}
