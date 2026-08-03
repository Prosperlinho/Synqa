import { NextResponse, type NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { scamReportSchema } from '@/lib/validation';
import { createScamReport } from '@/server/report-service';
import { checkRateLimit, reportLimiter, getClientIdentifier } from '@/lib/rate-limit';
import { getCurrentUser } from '@/lib/auth';

/** Verifies a Cloudflare Turnstile token server-side. No-ops in dev mode. */
async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return token === 'dev-mode-token'; // local/demo fallback only
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await res.json();
    return !!data.success;
  } catch {
    return false;
  }
}

/** Very lightweight heuristic spam filter on top of moderation review. */
function looksLikeSpam(description: string): boolean {
  const linkCount = (description.match(/https?:\/\//g) ?? []).length;
  const repeatedChar = /(.)\1{9,}/.test(description);
  return linkCount > 5 || repeatedChar;
}

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  const { success } = await checkRateLimit(reportLimiter, identifier, 5, 10 * 60_000);
  if (!success) {
    return NextResponse.json({ error: 'Too many reports submitted. Please try again later.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = scamReportSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid submission' }, { status: 400 });
  }

  const captchaOk = await verifyCaptcha(parsed.data.captchaToken);
  if (!captchaOk) {
    return NextResponse.json({ error: 'Captcha verification failed' }, { status: 400 });
  }

  if (looksLikeSpam(parsed.data.description)) {
    return NextResponse.json({ error: 'Submission flagged as spam. Please revise and resubmit.' }, { status: 400 });
  }

  const user = await getCurrentUser().catch(() => null);
  const ipHash = createHash('sha256').update(identifier + (process.env.IP_HASH_SALT ?? '')).digest('hex');

  const report = await createScamReport(parsed.data, user?.id ?? null, ipHash);

  return NextResponse.json({ report }, { status: 201 });
}
