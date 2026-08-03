import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { WalletHeader } from '@/components/wallet/wallet-header';
import { TrustRiskMeter } from '@/components/wallet/trust-risk-meter';
import { AiSummaryCard } from '@/components/wallet/ai-summary-card';
import { WalletInfoCard } from '@/components/wallet/wallet-info-card';
import { HoldingsTable } from '@/components/wallet/holdings-table';
import { NftGrid } from '@/components/wallet/nft-grid';
import { ActivityFeed } from '@/components/wallet/activity-feed';
import { ReportCard } from '@/components/reports/report-card';
import { getWalletByAddress } from '@/server/wallet-service';
import { getReportsForWallet } from '@/server/report-service';
import { FlagTriangleRight, SearchX } from 'lucide-react';
import type { Chain } from '@/types';

export const dynamic = 'force-dynamic';

export default async function WalletDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ address: string }>;
  searchParams: Promise<{ chain?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const chain = resolvedSearchParams.chain as Chain | undefined;
  const wallet = await getWalletByAddress(decodeURIComponent(resolvedParams.address), chain);

  if (!wallet) {
    return (
      <div className="container py-24 max-w-lg text-center">
        <SearchX className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-60" />
        <h1 className="font-display text-xl font-semibold mb-2">No known public owner found.</h1>
        <p className="text-sm text-muted-foreground mb-6">
          This address is not yet indexed by TrustWallet AI. That does not mean it is safe
          or unsafe — we simply have no report or label on record. We never invent
          identities for private wallet owners.
        </p>
        <div className="flex justify-center gap-3">
          <Button asChild variant="outline"><Link href="/search">Try another search</Link></Button>
          <Button asChild>
            <Link href={`/report?address=${encodeURIComponent(resolvedParams.address)}`}>
              <FlagTriangleRight className="h-4 w-4" /> Report this address
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const reports = await getReportsForWallet(wallet.address, wallet.id);

  return (
    <div className="container py-10 grid lg:grid-cols-[1fr_320px] gap-8">
      <div className="min-w-0">
        <WalletHeader wallet={wallet} />

        <div className="mt-8">
          <AiSummaryCard summary={wallet.aiSummary} />
        </div>

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="lg:hidden"><WalletInfoCard wallet={wallet} /></div>
            <ActivityFeed activity={wallet.activity.slice(0, 5)} />
          </TabsContent>

          <TabsContent value="holdings" className="space-y-6">
            <HoldingsTable holdings={wallet.holdings} />
            <NftGrid nfts={wallet.nfts} />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityFeed activity={wallet.activity} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {reports.length} moderator-approved report{reports.length === 1 ? '' : 's'}
              </p>
              <Button asChild size="sm" variant="outline">
                <Link href={`/report?address=${encodeURIComponent(wallet.address)}&chain=${wallet.chain}`}>
                  <FlagTriangleRight className="h-3.5 w-3.5" /> Report this wallet
                </Link>
              </Button>
            </div>
            {reports.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No public reports for this wallet yet.</p>
            ) : (
              reports.map((r) => <ReportCard key={r.id} report={r} />)
            )}
          </TabsContent>
        </Tabs>
      </div>

      <aside className="hidden lg:flex flex-col gap-6">
        <div className="flex justify-center py-2">
          <TrustRiskMeter riskScore={wallet.riskScore} trustScore={wallet.trustScore} />
        </div>
        <WalletInfoCard wallet={wallet} />
      </aside>
    </div>
  );
}
