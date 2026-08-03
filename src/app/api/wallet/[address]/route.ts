import { NextResponse, type NextRequest } from 'next/server';
import { getWalletByAddress } from '@/server/wallet-service';
import type { Chain } from '@/types';

export async function GET(request: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  const { address } = await params;
  const chain = request.nextUrl.searchParams.get('chain') as Chain | null;
  const wallet = await getWalletByAddress(decodeURIComponent(address), chain ?? undefined);

  if (!wallet) {
    return NextResponse.json(
      { error: 'No known public owner found.', wallet: null },
      { status: 404 }
    );
  }

  return NextResponse.json({ wallet });
}
