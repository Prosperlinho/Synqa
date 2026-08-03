import { AddLabelForm } from '@/components/admin/add-label-form';
import { DemoModeBanner } from '@/components/admin/demo-mode-banner';
import { AccessDenied } from '@/components/admin/access-denied';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddressChip } from '@/components/shared/address-chip';
import { MOCK_WALLETS } from '@/lib/mock-data';
import { USE_LIVE_DATABASE } from '@/server/data-source';
import { requireAdmin, UnauthorizedError } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLabelsPage() {
  if (USE_LIVE_DATABASE) {
    try {
      await requireAdmin();
    } catch (e) {
      if (e instanceof UnauthorizedError) return <AccessDenied message="Only admins can manage wallet labels." />;
      throw e;
    }
  }

  const labeled = MOCK_WALLETS.filter((w) => w.labels.length > 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Wallet labels</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Verified labels appear directly on a wallet&apos;s profile and feed the risk-scoring engine.
      </p>
      {!USE_LIVE_DATABASE && <DemoModeBanner />}

      <div className="mb-6"><AddLabelForm /></div>

      <div className="flex flex-col gap-3">
        {labeled.map((w) => (
          <Card key={w.id}>
            <CardContent className="p-4 flex flex-wrap items-center gap-3">
              <AddressChip address={w.ens ?? w.address} />
              <div className="flex flex-wrap gap-1.5">
                {w.labels.map((l) => (
                  <Badge key={l.id} variant="outline">{l.label} · {l.confidence}%</Badge>
                ))}
              </div>
              <span className="text-xs text-muted-foreground ml-auto">source: {w.labels[0].source.toLowerCase()}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
