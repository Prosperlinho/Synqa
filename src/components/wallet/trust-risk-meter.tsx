'use client';

/**
 * The page's signature element: risk and trust are drawn as two concentric
 * arcs that always move in relation to each other, because on this platform
 * they are never independent numbers — a wallet's trust score is partly
 * defined by the absence (or presence) of risk evidence. A single "score
 * card" would flatten that relationship; this keeps it visible.
 */
export function TrustRiskMeter({ riskScore, trustScore }: { riskScore: number; trustScore: number }) {
  const size = 168;
  const stroke = 10;
  const r1 = size / 2 - stroke; // outer: risk
  const r2 = r1 - stroke - 6; // inner: trust
  const c1 = 2 * Math.PI * r1;
  const c2 = 2 * Math.PI * r2;

  const riskOffset = c1 - (riskScore / 100) * c1;
  const trustOffset = c2 - (trustScore / 100) * c2;

  const riskColor =
    riskScore >= 80 ? 'hsl(var(--risk-critical))' : riskScore >= 55 ? 'hsl(var(--risk-high))' : riskScore >= 30 ? 'hsl(var(--risk-medium))' : 'hsl(var(--risk-low))';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r1} stroke="hsl(var(--muted))" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r1}
          stroke={riskColor}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c1}
          strokeDashoffset={riskOffset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
        <circle cx={size / 2} cy={size / 2} r={r2} stroke="hsl(var(--muted))" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r2}
          stroke="hsl(var(--trust))"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c2}
          strokeDashoffset={trustOffset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-700 ease-out delay-150"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-display font-semibold font-tabular leading-none">{riskScore}</span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">Risk</span>
        <span className="text-xs font-tabular text-trust mt-1.5">{trustScore} trust</span>
      </div>
    </div>
  );
}
