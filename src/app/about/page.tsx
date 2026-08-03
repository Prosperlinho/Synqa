import { ShieldCheck, Users, Scale } from 'lucide-react';

export const metadata = { title: 'About — TrustWallet AI' };

export default function AboutPage() {
  return (
    <div className="container py-16 max-w-2xl">
      <h1 className="font-display text-3xl font-semibold mb-4">About TrustWallet AI</h1>
      <p className="text-muted-foreground leading-relaxed mb-8">
        TrustWallet AI is a community-driven wallet intelligence platform. We help people
        check a wallet address before they send funds, interact with a contract, or trust
        a counterparty — by surfacing moderated, evidence-based reports rather than guesses.
      </p>

      <div className="grid gap-6">
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-medium mb-1">Evidence over assumption</h2>
            <p className="text-sm text-muted-foreground">
              We never invent identities for private wallet owners. Every entity label,
              risk score, and AI summary traces back to a verifiable source or a
              moderator-approved report.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-md bg-trust/10 flex items-center justify-center shrink-0">
            <Users className="h-5 w-5 text-trust" />
          </div>
          <div>
            <h2 className="font-medium mb-1">Community-moderated</h2>
            <p className="text-sm text-muted-foreground">
              Anyone can submit a scam report with evidence. Nothing goes public until a
              moderator reviews it, which keeps the signal-to-noise ratio high.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="h-10 w-10 rounded-md bg-verified/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-verified" />
          </div>
          <div>
            <h2 className="font-medium mb-1">Built for every major chain</h2>
            <p className="text-sm text-muted-foreground">
              Ethereum, BNB Chain, Solana, Base, Arbitrum, Polygon, Avalanche, Optimism,
              and Tron today — with an architecture designed to add more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
