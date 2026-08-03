import { Suspense } from 'react';
import { SearchFilters } from '@/components/shared/search-filters';
import { WalletResultRow } from '@/components/shared/wallet-result-row';
import { Skeleton } from '@/components/ui/skeleton';
import { searchWallets } from '@/server/wallet-service';
import type { Chain } from '@/types';
import { SearchX } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function Results({ query, chain }: { query: string; chain?: Chain }) {
  if (!query) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <SearchX className="h-8 w-8 mx-auto mb-3 opacity-50" />
        <p>Enter a wallet address, ENS name, domain, exchange, or entity name to begin.</p>
      </div>
    );
  }

  const results = await searchWallets(query, chain);

  if (results.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <SearchX className="h-8 w-8 mx-auto mb-3 opacity-50" />
        <p className="font-medium text-foreground">No known public owner found.</p>
        <p className="text-sm mt-1 max-w-md mx-auto">
          We have no indexed record for &ldquo;{query}&rdquo;. This does not imply the wallet
          is safe or unsafe — it simply hasn&apos;t been reported or labeled yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">{results.length} result{results.length === 1 ? '' : 's'}</p>
      {results.map((w) => (
        <WalletResultRow key={w.id} wallet={w} />
      ))}
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg" />
      ))}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; chain?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q ?? '';
  const chain = (resolvedParams.chain as Chain | undefined) ?? undefined;

  return (
    <div className="container py-12 max-w-3xl">
      <h1 className="font-display text-2xl font-semibold mb-1">Search wallets</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Search by wallet address, ENS, domain, exchange, blockchain, or entity name.
      </p>
      <div className="mb-8">
        <Suspense fallback={<div className="h-11" />}>
          <SearchFilters />
        </Suspense>
      </div>
      <Suspense key={`${query}-${chain}`} fallback={<ResultsSkeleton />}>
        <Results query={query} chain={chain} />
      </Suspense>
    </div>
  );
}
