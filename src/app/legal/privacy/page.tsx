export const metadata = { title: 'Privacy Policy — TrustWallet AI' };

export default function PrivacyPage() {
  return (
    <div className="container py-16 max-w-2xl prose-sm">
      <h1 className="font-display text-3xl font-semibold mb-4">Privacy Policy</h1>
      <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
        <p>
          This is placeholder legal copy for the TrustWallet AI demo application. Replace
          this page with your organization&apos;s actual Privacy Policy before launch.
        </p>
        <p>
          <strong className="text-foreground">What we store.</strong> Account email and
          username, connected wallet address (if you choose to connect one), and content
          you submit (reports, comments, votes, bookmarks).
        </p>
        <p>
          <strong className="text-foreground">IP addresses.</strong> For spam and abuse
          prevention, we store a salted hash of the submitting IP address alongside scam
          reports — never the raw IP — see <code className="font-mono">ipHash</code> in
          the Prisma schema.
        </p>
        <p>
          <strong className="text-foreground">Public wallet data.</strong> On-chain
          activity is inherently public. Labels, scores, and reports about a wallet
          address are not personal data about an individual unless that individual has
          independently and verifiably identified themselves as the owner.
        </p>
      </div>
    </div>
  );
}
