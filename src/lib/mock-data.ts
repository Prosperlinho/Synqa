import type {
  WalletDetail,
  WalletSummary,
  ScamReportSummary,
  PlatformStats,
} from '@/types';

/**
 * Demo dataset used when the app runs without a configured DATABASE_URL, and
 * in Storybook-style local development. Every service function in
 * `src/server/*` reads from here first and falls back to Prisma once real
 * credentials are present — see `src/server/data-source.ts`.
 *
 * All addresses below are well-known PUBLIC addresses (major exchange hot
 * wallets, the null address, etc.) or clearly synthetic examples. Nothing
 * here fabricates a private individual's identity.
 */

export const MOCK_WALLETS: WalletDetail[] = [
  {
    id: 'w_binance14',
    address: '0x28C6c06298d514Db089934071355E5743bf21d60',
    chain: 'ETHEREUM',
    ens: null,
    walletType: 'EXCHANGE',
    entityName: 'Binance',
    exchangeName: 'Binance Hot Wallet 14',
    isContract: false,
    verificationStatus: 'OFFICIALLY_VERIFIED',
    riskScore: 4,
    trustScore: 96,
    scamReportsCount: 0,
    labels: [{ id: 'l1', label: 'Exchange Hot Wallet', source: 'PARTNER_FEED', confidence: 99 }],
    firstSeenAt: '2019-04-11T00:00:00.000Z',
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    txCount: 18420933,
    tokenHoldingsCount: 214,
    nftHoldingsCount: 0,
    connectedChains: ['ETHEREUM', 'BNB_CHAIN'],
    holdings: [
      { id: 'h1', tokenSymbol: 'USDT', tokenName: 'Tether', balance: '412,003,221', usdValue: 412003221 },
      { id: 'h2', tokenSymbol: 'ETH', tokenName: 'Ethereum', balance: '98,221', usdValue: 341_000_000 },
    ],
    nfts: [],
    activity: [
      { id: 'a1', txHash: '0xa1b2...9f21', direction: 'OUT', counterparty: '0x71c...92ab', valueUsd: 120000, occurredAt: new Date(Date.now() - 1000 * 60 * 6).toISOString() },
      { id: 'a2', txHash: '0xa1b2...9f22', direction: 'IN', counterparty: '0x99a...11cd', valueUsd: 82000, occurredAt: new Date(Date.now() - 1000 * 60 * 22).toISOString() },
    ],
    aiSummary: {
      headline: 'No scam reports on record. Officially verified.',
      body: 'Binance Hot Wallet 14 has been officially verified by TrustWallet AI and has no approved scam reports. As with any wallet, always confirm transaction details independently before sending funds.',
      confidence: 'high',
      basedOnReports: 0,
      generatedAt: new Date().toISOString(),
    },
  },
  {
    id: 'w_scam_phish_01',
    address: '0x00e1a3B2C4d5e6F7a8b9C0d1E2f3A4B5c6D7e8F9',
    chain: 'ETHEREUM',
    ens: 'freeairdrop-claim.eth',
    walletType: 'PERSONAL',
    entityName: null,
    exchangeName: null,
    isContract: false,
    verificationStatus: 'FLAGGED_SCAM',
    riskScore: 92,
    trustScore: 3,
    scamReportsCount: 14,
    labels: [
      { id: 'l2', label: 'Known Phishing', source: 'COMMUNITY', confidence: 95 },
      { id: 'l3', label: 'Fake Airdrop Contract Interaction', source: 'HEURISTIC', confidence: 80 },
    ],
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9).toISOString(),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    txCount: 341,
    tokenHoldingsCount: 2,
    nftHoldingsCount: 0,
    connectedChains: ['ETHEREUM', 'BASE'],
    holdings: [{ id: 'h3', tokenSymbol: 'ETH', tokenName: 'Ethereum', balance: '0.42', usdValue: 1460 }],
    nfts: [],
    activity: [
      { id: 'a3', txHash: '0x77fd...12aa', direction: 'IN', counterparty: '0x55c...81ef', valueUsd: 3200, occurredAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
    ],
    aiSummary: {
      headline: 'Flagged by the community — 14 verified reports.',
      body: 'This wallet has 14 moderator-approved scam reports for: phishing, fake giveaway. Exercise caution before interacting or sending funds. This assessment is based only on reports that passed moderation review — it reflects reported and verified activity, not a certainty of intent.',
      confidence: 'high',
      basedOnReports: 14,
      generatedAt: new Date().toISOString(),
    },
  },
  {
    id: 'w_unknown_01',
    address: '0x9F1c2D3e4F5a6B7c8D9e0F1a2B3c4D5e6F7a8B9c',
    chain: 'BASE',
    ens: null,
    walletType: 'UNKNOWN',
    entityName: null,
    exchangeName: null,
    isContract: false,
    verificationStatus: 'UNVERIFIED',
    riskScore: 18,
    trustScore: 46,
    scamReportsCount: 0,
    labels: [],
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 210).toISOString(),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    txCount: 58,
    tokenHoldingsCount: 4,
    nftHoldingsCount: 2,
    connectedChains: ['BASE'],
    holdings: [{ id: 'h4', tokenSymbol: 'USDC', tokenName: 'USD Coin', balance: '1,204.50', usdValue: 1204.5 }],
    nfts: [{ id: 'n1', collection: 'Base Punks', tokenId: '#2291', imageUrl: null, floorPriceUsd: 40 }],
    activity: [],
    aiSummary: {
      headline: 'No scam reports found for this wallet.',
      body: 'There is currently no moderator-approved scam report associated with this address. This does not guarantee the wallet is safe — it means no verified report exists yet. Exercise normal caution, and check labels and transaction history before interacting.',
      confidence: 'medium',
      basedOnReports: 0,
      generatedAt: new Date().toISOString(),
    },
  },
  {
    id: 'w_rugpull_01',
    address: '0x4A2b8C1d0E9f8A7b6C5d4E3f2A1b0C9d8E7f6A5b',
    chain: 'BNB_CHAIN',
    ens: null,
    walletType: 'CONTRACT',
    entityName: null,
    exchangeName: null,
    isContract: true,
    verificationStatus: 'FLAGGED_SCAM',
    riskScore: 88,
    trustScore: 6,
    scamReportsCount: 7,
    labels: [{ id: 'l4', label: 'Rug Pull Contract', source: 'COMMUNITY', confidence: 90 }],
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 33).toISOString(),
    txCount: 1122,
    tokenHoldingsCount: 1,
    nftHoldingsCount: 0,
    connectedChains: ['BNB_CHAIN'],
    holdings: [],
    nfts: [],
    activity: [],
    aiSummary: {
      headline: 'Flagged by the community — 7 verified reports.',
      body: 'This contract has 7 moderator-approved scam reports for: rug pull. Exercise caution before interacting or sending funds. This assessment is based only on reports that passed moderation review — it reflects reported and verified activity, not a certainty of intent.',
      confidence: 'high',
      basedOnReports: 7,
      generatedAt: new Date().toISOString(),
    },
  },
];

export const MOCK_TRENDING_SCAMS: WalletSummary[] = MOCK_WALLETS.filter((w) => w.riskScore >= 55).map((w) => ({
  id: w.id,
  address: w.address,
  chain: w.chain,
  ens: w.ens,
  walletType: w.walletType,
  entityName: w.entityName,
  exchangeName: w.exchangeName,
  isContract: w.isContract,
  verificationStatus: w.verificationStatus,
  riskScore: w.riskScore,
  trustScore: w.trustScore,
  scamReportsCount: w.scamReportsCount,
}));

export const MOCK_RECENTLY_VERIFIED: WalletSummary[] = MOCK_WALLETS.filter(
  (w) => w.verificationStatus === 'OFFICIALLY_VERIFIED' || w.verificationStatus === 'COMMUNITY_VERIFIED'
).map((w) => ({
  id: w.id,
  address: w.address,
  chain: w.chain,
  ens: w.ens,
  walletType: w.walletType,
  entityName: w.entityName,
  exchangeName: w.exchangeName,
  isContract: w.isContract,
  verificationStatus: w.verificationStatus,
  riskScore: w.riskScore,
  trustScore: w.trustScore,
  scamReportsCount: w.scamReportsCount,
}));

export const MOCK_LATEST_REPORTS: ScamReportSummary[] = [
  {
    id: 'r1',
    walletAddress: '0x00e1a3B2C4d5e6F7a8b9C0d1E2f3A4B5c6D7e8F9',
    chain: 'ETHEREUM',
    category: 'PHISHING',
    description:
      'Sent a fake "claim your airdrop" link via Discord DM impersonating a project moderator. Site prompted wallet connect then drained approvals.',
    transactionHash: '0x77fd12aa99e2b1c4d5e6f7a8b9c0d1e2f3a4b5c6',
    websiteUrl: 'https://freeairdrop-claim-example.com',
    socialMediaUrl: null,
    incidentDate: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    status: 'APPROVED',
    upvotes: 41,
    downvotes: 2,
    commentsCount: 9,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    reporterUsername: 'onchain_sleuth',
  },
  {
    id: 'r2',
    walletAddress: '0x4A2b8C1d0E9f8A7b6C5d4E3f2A1b0C9d8E7f6A5b',
    chain: 'BNB_CHAIN',
    category: 'RUG_PULL',
    description:
      'Deployed token contract with hidden mint function, marketed as "audited," pulled 400k liquidity 6 hours after launch.',
    transactionHash: '0x11ab22cd33ef44aa55bb66cc77dd88ee99ff00a',
    websiteUrl: null,
    socialMediaUrl: 'https://x.com/example_handle',
    incidentDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 33).toISOString(),
    status: 'APPROVED',
    upvotes: 118,
    downvotes: 4,
    commentsCount: 27,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 32).toISOString(),
    reporterUsername: 'defi_watchdog',
  },
  {
    id: 'r3',
    walletAddress: '0x2Bb4c5D6e7F8a9B0c1D2e3F4a5B6c7D8e9F0a1B2',
    chain: 'POLYGON',
    category: 'FAKE_GIVEAWAY',
    description:
      'Comment-spammed a celebrity\'s post promising to "double any ETH sent within 10 minutes" — classic giveaway scam pattern.',
    transactionHash: null,
    websiteUrl: null,
    socialMediaUrl: 'https://x.com/example_scam_acct',
    incidentDate: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    status: 'PENDING',
    upvotes: 3,
    downvotes: 0,
    commentsCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    reporterUsername: 'anon_reporter_44',
  },
];

export const MOCK_STATS: PlatformStats = {
  totalWalletsIndexed: 4_218_930,
  totalScamReports: 61_204,
  totalVerifiedWallets: 12_884,
  totalUsers: 88_412,
  reportsThisWeek: 742,
  chainsSupported: 9,
};

export interface MockUser {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
  reputation: number;
  createdAt: string;
}

export const MOCK_USERS: MockUser[] = [
  { id: 'u1', username: 'onchain_sleuth', email: 'sleuth@example.com', role: 'MODERATOR', status: 'ACTIVE', reputation: 4820, createdAt: '2023-02-14T00:00:00.000Z' },
  { id: 'u2', username: 'defi_watchdog', email: 'watchdog@example.com', role: 'USER', status: 'ACTIVE', reputation: 2210, createdAt: '2023-08-02T00:00:00.000Z' },
  { id: 'u3', username: 'anon_reporter_44', email: 'anon44@example.com', role: 'USER', status: 'ACTIVE', reputation: 40, createdAt: '2026-06-01T00:00:00.000Z' },
  { id: 'u4', username: 'admin_root', email: 'admin@trustwallet.ai', role: 'ADMIN', status: 'ACTIVE', reputation: 9999, createdAt: '2022-11-01T00:00:00.000Z' },
  { id: 'u5', username: 'spammy_mcspamface', email: 'spam@example.com', role: 'USER', status: 'SUSPENDED', reputation: -50, createdAt: '2026-05-20T00:00:00.000Z' },
];

export function findMockWalletByAddress(address: string): WalletDetail | undefined {
  const normalized = address.trim().toLowerCase();
  return MOCK_WALLETS.find((w) => w.address.toLowerCase() === normalized || w.ens?.toLowerCase() === normalized);
}

export function searchMockWallets(query: string): WalletSummary[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOCK_WALLETS.filter(
    (w) =>
      w.address.toLowerCase().includes(q) ||
      w.ens?.toLowerCase().includes(q) ||
      w.entityName?.toLowerCase().includes(q) ||
      w.exchangeName?.toLowerCase().includes(q)
  ).map((w) => ({
    id: w.id,
    address: w.address,
    chain: w.chain,
    ens: w.ens,
    walletType: w.walletType,
    entityName: w.entityName,
    exchangeName: w.exchangeName,
    isContract: w.isContract,
    verificationStatus: w.verificationStatus,
    riskScore: w.riskScore,
    trustScore: w.trustScore,
    scamReportsCount: w.scamReportsCount,
  }));
}
