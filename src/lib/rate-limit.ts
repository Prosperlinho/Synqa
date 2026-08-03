import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const hasUpstash = !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasUpstash
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : undefined;

// Separate, deliberately tighter limiter for write endpoints prone to abuse
// (scam reports, votes, comments) vs. a looser one for search.
export const reportLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '10 m'), prefix: 'rl:report' })
  : null;

export const voteLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '1 m'), prefix: 'rl:vote' })
  : null;

export const searchLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), prefix: 'rl:search' })
  : null;

// Simple in-memory fallback so the app still runs locally without Upstash configured.
const memoryHits = new Map<string, number[]>();

export async function checkRateLimit(
  limiter: Ratelimit | null,
  key: string,
  fallbackMax = 20,
  fallbackWindowMs = 60_000
): Promise<{ success: boolean; remaining: number }> {
  if (limiter) {
    const { success, remaining } = await limiter.limit(key);
    return { success, remaining };
  }

  const now = Date.now();
  const hits = (memoryHits.get(key) ?? []).filter((t) => now - t < fallbackWindowMs);
  hits.push(now);
  memoryHits.set(key, hits);
  return { success: hits.length <= fallbackMax, remaining: Math.max(0, fallbackMax - hits.length) };
}

export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() ?? 'unknown';
}
