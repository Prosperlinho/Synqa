import type { AiRiskSummary } from '@/types';

export interface SummaryEvidence {
  walletLabel: string; // e.g. truncated address or ENS, never an inferred name
  approvedReportsCount: number;
  categories: string[]; // distinct scam categories from approved reports only
  isOfficiallyVerified: boolean;
  isCommunityVerified: boolean;
  entityName: string | null;
  riskScore: number;
}

/**
 * Builds the "AI risk analysis" summary shown on a wallet page.
 *
 * Hard rule: this function must never assert anything that isn't directly
 * derivable from `evidence`. It does not guess intent, does not name an owner
 * unless `entityName` was already independently verified, and it always
 * states what it does NOT know when reports are absent or unmoderated.
 *
 * In production this can optionally call the Anthropic API to vary phrasing,
 * but the prompt must be constrained to rephrase these exact facts only —
 * never asked to speculate beyond them.
 */
export function generateAiRiskSummary(evidence: SummaryEvidence): AiRiskSummary {
  const now = new Date().toISOString();

  if (evidence.approvedReportsCount === 0) {
    if (evidence.isOfficiallyVerified) {
      return {
        headline: 'No scam reports on record. Officially verified.',
        body: `${evidence.entityName ?? 'This wallet'} has been officially verified by Synqa and has no approved scam reports. As with any wallet, always confirm transaction details independently before sending funds.`,
        confidence: 'high',
        basedOnReports: 0,
        generatedAt: now,
      };
    }
    return {
      headline: 'No scam reports found for this wallet.',
      body: 'There is currently no moderator-approved scam report associated with this address. This does not guarantee the wallet is safe — it means no verified report exists yet. Exercise normal caution, and check labels and transaction history before interacting.',
      confidence: 'medium',
      basedOnReports: 0,
      generatedAt: now,
    };
  }

  const categoryList = evidence.categories.map((c) => c.toLowerCase().replace(/_/g, ' ')).join(', ');
  const plural = evidence.approvedReportsCount === 1 ? 'report' : 'reports';

  return {
    headline: `Flagged by the community — ${evidence.approvedReportsCount} verified ${plural}.`,
    body: `This wallet has ${evidence.approvedReportsCount} moderator-approved scam ${plural} for: ${categoryList}. Exercise caution before interacting or sending funds. This assessment is based only on reports that passed moderation review — it reflects reported and verified activity, not a certainty of intent.`,
    confidence: evidence.approvedReportsCount >= 3 ? 'high' : 'medium',
    basedOnReports: evidence.approvedReportsCount,
    generatedAt: now,
  };
}
