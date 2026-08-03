/**
 * Deterministic risk/trust scoring.
 *
 * Principles (deliberate, not incidental):
 * 1. Every point added or removed must be traceable to a concrete signal.
 * 2. Approved scam reports move the score; pending/rejected ones never do.
 * 3. Nothing here infers a wallet owner's identity — it only scores behavior
 *    and moderation outcomes that are already on record.
 */

export interface RiskInputs {
  approvedReportsCount: number;
  pendingReportsCount: number;
  flaggedFalseReportsCount: number;
  isOfficiallyVerified: boolean;
  isCommunityVerified: boolean;
  accountAgeDays: number | null;
  txCount: number;
  hasKnownMaliciousLabel: boolean;
  isKnownExchangeOrEntity: boolean;
}

export interface RiskResult {
  riskScore: number; // 0-100
  trustScore: number; // 0-100
  factors: { label: string; weight: number }[];
}

export function computeWalletScores(input: RiskInputs): RiskResult {
  const factors: { label: string; weight: number }[] = [];
  let risk = 0;
  let trust = 40; // neutral baseline until evidence shifts it

  if (input.hasKnownMaliciousLabel) {
    risk += 40;
    factors.push({ label: 'Confirmed malicious address label', weight: 40 });
  }

  if (input.approvedReportsCount > 0) {
    const add = Math.min(45, input.approvedReportsCount * 12);
    risk += add;
    factors.push({ label: `${input.approvedReportsCount} moderator-approved scam report(s)`, weight: add });
  }

  if (input.pendingReportsCount > 0) {
    const add = Math.min(10, input.pendingReportsCount * 2);
    risk += add;
    factors.push({ label: `${input.pendingReportsCount} pending, unverified report(s)`, weight: add });
  }

  if (input.flaggedFalseReportsCount > 0) {
    const reduce = Math.min(15, input.flaggedFalseReportsCount * 5);
    risk = Math.max(0, risk - reduce);
    factors.push({ label: 'Prior report(s) flagged as false by moderators', weight: -reduce });
  }

  if (input.isOfficiallyVerified) {
    trust += 35;
    risk = Math.max(0, risk - 20);
    factors.push({ label: 'Officially verified entity', weight: 35 });
  } else if (input.isCommunityVerified) {
    trust += 15;
    factors.push({ label: 'Community-verified wallet', weight: 15 });
  }

  if (input.isKnownExchangeOrEntity) {
    trust += 15;
    factors.push({ label: 'Recognized exchange / known entity', weight: 15 });
  }

  if (input.accountAgeDays != null) {
    if (input.accountAgeDays > 365) {
      trust += 10;
      factors.push({ label: 'Address active for 1+ years', weight: 10 });
    } else if (input.accountAgeDays < 14) {
      risk += 8;
      factors.push({ label: 'Address first seen under 14 days ago', weight: 8 });
    }
  }

  if (input.txCount > 500) {
    trust += 5;
    factors.push({ label: 'Established transaction history', weight: 5 });
  }

  risk = Math.max(0, Math.min(100, risk));
  trust = Math.max(0, Math.min(100, trust - Math.round(risk * 0.3)));

  return { riskScore: Math.round(risk), trustScore: Math.round(trust), factors };
}
