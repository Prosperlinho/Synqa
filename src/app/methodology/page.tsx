import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata = { title: 'Scoring methodology — Synqa' };

const FACTORS = [
  { label: 'Confirmed malicious address label', effect: '+40 risk', tone: 'risk' },
  { label: 'Each moderator-approved scam report', effect: 'up to +45 risk total', tone: 'risk' },
  { label: 'Each pending, unverified report', effect: 'up to +10 risk total', tone: 'risk' },
  { label: 'Reports flagged as false by moderators', effect: 'up to −15 risk', tone: 'trust' },
  { label: 'Officially verified entity', effect: '+35 trust, −20 risk', tone: 'trust' },
  { label: 'Community-verified wallet', effect: '+15 trust', tone: 'trust' },
  { label: 'Recognized exchange / known entity', effect: '+15 trust', tone: 'trust' },
  { label: 'Address active for 1+ years', effect: '+10 trust', tone: 'trust' },
  { label: 'Address first seen under 14 days ago', effect: '+8 risk', tone: 'risk' },
  { label: 'Established transaction history (500+ txns)', effect: '+5 trust', tone: 'trust' },
];

export default function MethodologyPage() {
  return (
    <div className="container py-16 max-w-2xl">
      <h1 className="font-display text-3xl font-semibold mb-4">Scoring methodology</h1>
      <p className="text-muted-foreground leading-relaxed mb-8">
        Risk and trust scores (0–100) are computed deterministically from evidence already
        on record — never from assumptions about who a wallet belongs to. Every point
        added or removed traces back to one of the factors below.
      </p>

      <Card>
        <CardHeader><CardTitle className="text-base">Scoring factors</CardTitle></CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col divide-y divide-border/70">
            {FACTORS.map((f) => (
              <div key={f.label} className="flex items-center justify-between py-3 text-sm">
                <span>{f.label}</span>
                <span className={f.tone === 'risk' ? 'text-risk-high font-medium' : 'text-trust font-medium'}>
                  {f.effect}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground mt-6 leading-relaxed">
        The AI Risk Analysis summary shown on wallet pages is generated from this same
        evidence — it rephrases the factors above in plain language and never asserts
        anything beyond what a moderator has already confirmed. See{' '}
        <code className="font-mono">src/lib/risk-engine.ts</code> and{' '}
        <code className="font-mono">src/lib/ai-summary.ts</code> in the source for the exact logic.
      </p>
    </div>
  );
}
