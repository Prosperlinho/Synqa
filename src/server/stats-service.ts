import { prisma } from '@/lib/prisma';
import { USE_LIVE_DATABASE } from './data-source';
import { MOCK_STATS } from '@/lib/mock-data';
import { CHAIN_LIST } from '@/config/chains';
import type { PlatformStats } from '@/types';

export async function getPlatformStats(): Promise<PlatformStats> {
  if (!USE_LIVE_DATABASE) return MOCK_STATS;

  const weekAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

  const [totalWalletsIndexed, totalScamReports, totalVerifiedWallets, totalUsers, reportsThisWeek] =
    await Promise.all([
      prisma.wallet.count(),
      prisma.scamReport.count({ where: { status: 'APPROVED' } }),
      prisma.wallet.count({ where: { verificationStatus: { in: ['OFFICIALLY_VERIFIED', 'COMMUNITY_VERIFIED'] } } }),
      prisma.user.count(),
      prisma.scamReport.count({ where: { status: 'APPROVED', createdAt: { gte: weekAgo } } }),
    ]);

  return {
    totalWalletsIndexed,
    totalScamReports,
    totalVerifiedWallets,
    totalUsers,
    reportsThisWeek,
    chainsSupported: CHAIN_LIST.length,
  };
}
