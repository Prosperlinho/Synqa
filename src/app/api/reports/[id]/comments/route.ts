import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { getCurrentUser } from '@/lib/auth';
import { commentSchema } from '@/lib/validation';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Sign in to comment' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = commentSchema.safeParse({ ...body, reportId: id });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid comment' }, { status: 400 });

  if (!USE_LIVE_DATABASE) {
    return NextResponse.json({ id: `mock_comment_${Date.now()}`, demo: true }, { status: 201 });
  }

  const comment = await prisma.comment.create({
    data: {
      body: parsed.data.body,
      reportId: parsed.data.reportId,
      walletId: parsed.data.walletId,
      parentId: parsed.data.parentId,
      authorId: user.id,
    },
  });

  return NextResponse.json({ id: comment.id }, { status: 201 });
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!USE_LIVE_DATABASE) return NextResponse.json({ comments: [] });

  const comments = await prisma.comment.findMany({
    where: { reportId: id, isHidden: false },
    orderBy: { createdAt: 'desc' },
    include: { author: true },
  });

  return NextResponse.json({
    comments: comments.map((c) => ({
      id: c.id,
      author: c.author.username,
      body: c.body,
      createdAt: c.createdAt.toISOString(),
    })),
  });
}
