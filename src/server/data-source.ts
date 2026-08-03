/**
 * A single flag every service function checks, so swapping from the demo
 * dataset to a live Supabase/Postgres database is a one-line change (set
 * DATABASE_URL for real) rather than a rewrite.
 */
export const USE_LIVE_DATABASE = Boolean(
  process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost:5432/placeholder')
);
