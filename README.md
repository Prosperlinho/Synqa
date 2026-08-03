# TrustWallet AI

A Web3 wallet intelligence and reputation platform. Search any blockchain address to see
its risk score, trust score, verification status, and moderated scam reports — and report
malicious wallets with evidence.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Prisma, Supabase
(Postgres, Auth, Storage), and WalletConnect (via wagmi).

## ✨ What's included

- **Home page** — hero search, trending scam addresses, recently verified wallets, latest
  reports feed, platform statistics
- **Search** — by address, ENS, domain, exchange, blockchain, or entity name
- **Wallet profile pages** — risk/trust score meter, AI risk summary, entity/exchange
  labels, holdings, NFTs, activity feed, community reports with voting & comments
- **Scam reporting** — full form (category, description, tx hash, evidence upload, links,
  incident date) with captcha, rate limiting, and spam heuristics; every report starts
  `PENDING` and only becomes public once a moderator approves it
- **Community reputation** — upvote/downvote reports, comment, bookmark wallets, follow
  wallets for alerts
- **Admin panel** — moderation queue (approve/reject/flag-false), user management (ban),
  wallet label management, analytics dashboard, full audit log (`AdminLog`)
- **9 supported chains** out of the box (Ethereum, BNB Chain, Solana, Base, Arbitrum,
  Polygon, Avalanche, Optimism, Tron) via a single extensible registry
- **Security** — rate limiting (Upstash, with in-memory fallback), captcha (Cloudflare
  Turnstile, with a dev-mode fallback), Zod input validation everywhere, role-based
  permissions, Postgres Row Level Security policies
- Full dark/light mode, responsive layout throughout

## 🧠 Design principles baked into the product

- **Never invent identities.** Unknown wallets are shown as *"No known public owner
  found"* — the app does not guess who a private wallet belongs to.
- **Evidence-based scoring.** Risk/trust scores (`src/lib/risk-engine.ts`) and the AI risk
  summary (`src/lib/ai-summary.ts`) are deterministic and traceable to specific,
  moderator-approved evidence — never vibes, never speculation. See `/methodology` in the
  app for the live breakdown.
- **Moderation-gated publishing.** Nothing a user submits (reports, comments) becomes
  public until reviewed, by default.

## 🚀 Getting started

```bash
npm install
cp .env.example .env      # fill in Supabase + other values (see below)
npx prisma generate
npx prisma migrate dev    # creates tables from prisma/schema.prisma
npx prisma db seed        # optional: sample data
npm run dev
```

The app runs **without any environment variables configured** using a realistic in-memory
demo dataset (`src/lib/mock-data.ts`) — every page renders, search works, the admin panel
is browsable. This is controlled by `USE_LIVE_DATABASE` in `src/server/data-source.ts`,
which flips to `true` automatically once a real `DATABASE_URL` is set. That's the intended
way to preview the whole product before wiring up infrastructure.

Writes (voting, commenting, submitting reports) require Supabase Auth to be configured,
since they need a real signed-in user.

## 🔌 Wallet connectors

WalletConnect and browser-injected wallets (MetaMask, Rabby, Brave Wallet, etc.) are
implemented by hand in `src/config/connectors/` (`injected.ts`, `walletconnect.ts`)
directly on top of wagmi's `createConnector` primitive and
`@walletconnect/ethereum-provider` — **not** via the `wagmi/connectors` package.

That package bundles every connector (injected, WalletConnect, *and* Coinbase Wallet) in
one module, and recent `@coinbase/wallet-sdk` releases pull in `@coinbase/cdp-sdk` for
Smart Wallet / x402 agentic-payments support, which references an unresolvable
`@x402/evm/upto/client` subpath and breaks the build. Because it's a single barrel file,
even importing just `injected` from it drags the broken module into the build graph.
This project has **zero dependency on `@coinbase/*` or `@x402/*`, directly or
transitively** — confirmed by grepping the full source tree and dependency list. As a
second layer of protection, `package.json` also carries an `overrides` entry pinning
`@coinbase/wallet-sdk` to `3.9.3` (a stable release that predates the CDP dependency), in
case anything is ever added later that pulls it in.

If you want Coinbase Wallet back, add `wagmi/connectors`' `coinbaseWallet()` deliberately
and re-verify its dependency tree resolves cleanly first.

## 🔧 Environment variables

See `.env.example` for the full list. At minimum for a real deployment:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` / `DIRECT_URL` | Supabase Postgres connection (pooled / direct) |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only privileged operations |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect ("Connect wallet" button) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Scam-report captcha |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Distributed rate limiting |

## 🗄️ Database

`prisma/schema.prisma` defines every table described in the brief: `User`, `Wallet`,
`WalletLabel`, `WalletScoreHistory`, `TokenHolding`, `NftHolding`, `WalletActivity`,
`ScamReport`, `Evidence`, `Comment`, `Vote`, `Bookmark`, `WalletFollow`, `Notification`,
`AdminLog`, plus a `WalletConnectedChain` join table for multi-chain presence.

After running migrations against your Supabase project, apply the SQL in
`supabase/migrations/` (in order) via the Supabase SQL editor or CLI:

1. `0001_auth_user_sync.sql` — trigger that creates a `public.User` row whenever someone
   signs up through Supabase Auth
2. `0002_row_level_security.sql` — RLS policies (public read on wallet data, scoped writes)
3. `0003_storage_evidence_bucket.sql` — Storage bucket + policies for report evidence

## 🧱 Architecture

```
src/
  app/                    # App Router pages + API routes
    (marketing/site pages, /search, /wallet/[address], /report, /admin/*, /auth/*)
    api/                  # Route handlers — thin wrappers around src/server
  components/
    ui/                   # shadcn/ui primitives
    layout/                home/                wallet/
    report/                 reports/              admin/
    shared/                # cross-cutting bits (badges, chips, search filters)
  server/                 # Data-access layer — swaps mock data ⇄ Prisma via
                          # USE_LIVE_DATABASE, so routes/pages never talk to
                          # Prisma or mock data directly
  lib/                    # risk-engine, ai-summary, validation (zod), rate-limit,
                          # auth/session helpers, supabase clients, utils
  config/                 # chains.ts (extensible chain registry), wagmi.ts,
                          # connectors/ (hand-written injected + WalletConnect)
  types/                  # shared domain types
prisma/
  schema.prisma, seed.ts
supabase/
  migrations/             # RLS + triggers + storage (apply after prisma migrate)
```

**Adding a new chain** is one entry in `src/config/chains.ts` (label, explorer URL,
address regex) plus one value in the Prisma `Chain` enum — every filter, badge, and
explorer link picks it up automatically.

## 🛡️ Security notes

- All mutating API routes validate input with Zod, apply rate limiting, and (for scam
  reports) verify a captcha token server-side.
- IP addresses are never stored raw — only a salted SHA-256 hash (`ipHash` on
  `ScamReport`), used purely for abuse-pattern detection.
- Admin/moderator routes call `requireAdmin()` / `requireModeratorOrAdmin()`, which check
  both Supabase session and the user's `role`/`status` in Postgres, and every admin action
  writes an `AdminLog` row.
- Row Level Security is enabled on every public table — the Prisma/service-role connection
  bypasses RLS (as intended for the server), while any direct client-side Supabase access
  is constrained by the policies in `0002_row_level_security.sql`.

## 📦 Deploying to Vercel

1. Push this repo to GitHub/GitLab/Bitbucket and import it in Vercel.
2. Add the environment variables from `.env.example`.
3. Set the build command to `npm run build` (already runs `prisma generate` first) and
   add a **Postgres migration step** — either run `npx prisma migrate deploy` from CI
   before deploying, or use Vercel's "Deploy Hooks" / a one-off `vercel env pull && npx
   prisma migrate deploy` locally against production.
4. Apply the `supabase/migrations/*.sql` files via the Supabase dashboard.

## 🧪 What's stubbed / left as an extension point

This is a complete, coherent codebase rather than a wired-up SaaS with live infra — a few
things are intentionally left as clearly-marked seams rather than faked:

- Evidence file upload has a working Supabase Storage helper
  (`src/lib/supabase/storage.ts`) but the report form currently sends only a file *count*
  to the API; wiring the two together is a ~10 line change once a Storage bucket exists.
- The AI risk summary is a deterministic, evidence-grounded generator by default
  (`src/lib/ai-summary.ts`). It's written so an LLM call can be dropped in to vary
  phrasing — but the prompt must only ever be allowed to *rephrase* the same evidence
  object, never speculate beyond it.
- On-chain data (balances, NFTs, transaction history) is sample data. In production this
  layer would call an indexer (Alchemy, Covalent, Moralis, etc.) per chain inside
  `src/server/wallet-service.ts`.
