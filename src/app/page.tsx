import { Hero } from '@/components/home/hero';
import { TrendingScams } from '@/components/home/trending-scams';
import { RecentlyVerified } from '@/components/home/recently-verified';
import { LatestReports } from '@/components/home/latest-reports';
import { StatsSection } from '@/components/home/stats-section';
import { getTrendingScamWallets, getRecentlyVerifiedWallets } from '@/server/wallet-service';
import { getLatestApprovedReports } from '@/server/report-service';
import { getPlatformStats } from '@/server/stats-service';

export const revalidate = 60;

export default async function HomePage() {
  const [trending, verified, reports, stats] = await Promise.all([
    getTrendingScamWallets(),
    getRecentlyVerifiedWallets(),
    getLatestApprovedReports(6),
    getPlatformStats(),
  ]);

  return (
    <>
      <Hero />
      <TrendingScams wallets={trending} />
      <RecentlyVerified wallets={verified} />
      <LatestReports reports={reports} />
      <StatsSection stats={stats} />
    </>
  );
}
