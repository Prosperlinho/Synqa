import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  if (!USE_LIVE_DATABASE) return NextResponse.json({ notifications: [] });

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json({ notifications });
}

export async function PATCH(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in required' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const notificationId: string | undefined = body?.notificationId;
  if (!notificationId) return NextResponse.json({ error: 'notificationId required' }, { status: 400 });

  if (!USE_LIVE_DATABASE) return NextResponse.json({ ok: true, demo: true });

  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });

  return NextResponse.json({ ok: true });
}
