import { NextResponse, type NextRequest } from 'next/server';
import { requireAdmin, UnauthorizedError } from '@/lib/auth';
import { addWalletLabel } from '@/server/admin-service';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  walletAddress: z.string().min(4),
  label: z.string().min(2).max(80),
  confidence: z.number().min(0).max(100).default(90),
});

export async function POST(request: NextRequest) {
  try {
    const actor = USE_LIVE_DATABASE ? await requireAdmin() : { id: 'demo-admin' };
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid request' }, { status: 400 });

    if (!USE_LIVE_DATABASE) {
      return NextResponse.json({ ok: true, demo: true });
    }

    const wallet = await prisma.wallet.findFirst({
      where: { addressLower: parsed.data.walletAddress.toLowerCase() },
    });
    if (!wallet) return NextResponse.json({ error: 'Wallet not found. Index it first via a search.' }, { status: 404 });

    const created = await addWalletLabel(wallet.id, parsed.data.label, parsed.data.confidence, actor.id);
    return NextResponse.json({ label: created }, { status: 201 });
  } catch (e) {
    if (e instanceof UnauthorizedError) return NextResponse.json({ error: e.message }, { status: 403 });
    throw e;
  }
}
