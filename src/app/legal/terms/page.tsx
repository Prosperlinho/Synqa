export const metadata = { title: 'Terms of Service — Synqa' };

export default function TermsPage() {
  return (
    <div className="container py-16 max-w-2xl prose-sm">
      <h1 className="font-display text-3xl font-semibold mb-4">Terms of Service</h1>
      <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
        <p>
          This is placeholder legal copy for the Synqa demo application. Replace
          this page with your organization&apos;s actual Terms of Service before launch.
        </p>
        <p>
          <strong className="text-foreground">Scores are informational, not advice.</strong>{' '}
          Risk and trust scores, AI summaries, and community reports are provided for
          informational purposes only and do not constitute financial, legal, or
          investment advice. Always perform your own due diligence.
        </p>
        <p>
          <strong className="text-foreground">Report accuracy.</strong> Users submitting
          scam reports affirm the information provided is accurate to the best of their
          knowledge. Submitting knowingly false reports may result in account restriction.
        </p>
        <p>
          <strong className="text-foreground">No liability for third-party actions.</strong>{' '}
          Synqa is not responsible for losses resulting from interactions with
          any wallet address, verified or otherwise.
        </p>
      </div>
    </div>
  );
}
