import { NextResponse, type NextRequest } from 'next/server';
import { searchWallets } from '@/server/wallet-service';
import { searchQuerySchema } from '@/lib/validation';
import { checkRateLimit, searchLimiter, getClientIdentifier } from '@/lib/rate-limit';
import type { Chain } from '@/types';

export async function GET(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const { success } = await checkRateLimit(searchLimiter, identifier, 60, 60_000);
  if (!success) {
    return NextResponse.json({ error: 'Too many search requests. Please slow down.' }, { status: 429 });
  }

  const query = request.nextUrl.searchParams.get('q') ?? '';
  const chain = request.nextUrl.searchParams.get('chain') as Chain | null;

  const parsed = searchQuerySchema.safeParse({ query, chain: chain ?? undefined });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid query' }, { status: 400 });
  }

  const results = await searchWallets(parsed.data.query, parsed.data.chain);
  return NextResponse.json({ results });
}
