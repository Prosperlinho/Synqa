// Central domain types. Mirrors prisma/schema.prisma enums/shapes but kept
// framework-agnostic so client components don't need to import @prisma/client.

export type Chain =
  | 'ETHEREUM'
  | 'BNB_CHAIN'
  | 'SOLANA'
  | 'BASE'
  | 'ARBITRUM'
  | 'POLYGON'
  | 'AVALANCHE'
  | 'OPTIMISM'
  | 'TRON';

export type WalletType =
  | 'PERSONAL'
  | 'CONTRACT'
  | 'EXCHANGE'
  | 'BRIDGE'
  | 'MIXER'
  | 'CONTRACT_PROXY'
  | 'MULTISIG'
  | 'UNKNOWN';

export type VerificationStatus =
  | 'UNVERIFIED'
  | 'COMMUNITY_VERIFIED'
  | 'OFFICIALLY_VERIFIED'
  | 'FLAGGED_SCAM';

export type ScamCategory =
  | 'PHISHING'
  | 'RUG_PULL'
  | 'FAKE_GIVEAWAY'
  | 'IMPERSONATION'
  | 'ROMANCE_SCAM'
  | 'PONZI_SCHEME'
  | 'MALICIOUS_CONTRACT'
  | 'ADDRESS_POISONING'
  | 'FAKE_SUPPORT'
  | 'EXCHANGE_SCAM'
  | 'NFT_SCAM'
  | 'OTHER';

export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED_FALSE';

export type Role = 'USER' | 'MODERATOR' | 'ADMIN';

export interface WalletLabel {
  id: string;
  label: string;
  source: 'ADMIN' | 'COMMUNITY' | 'PARTNER_FEED' | 'HEURISTIC';
  confidence: number;
}

export interface TokenHolding {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  balance: string;
  usdValue: number | null;
}

export interface NftHolding {
  id: string;
  collection: string;
  tokenId: string;
  imageUrl: string | null;
  floorPriceUsd: number | null;
}

export interface WalletActivity {
  id: string;
  txHash: string;
  direction: 'IN' | 'OUT' | 'CONTRACT_CALL';
  counterparty: string | null;
  valueUsd: number | null;
  occurredAt: string;
}

export interface WalletSummary {
  id: string;
  address: string;
  chain: Chain;
  ens: string | null;
  walletType: WalletType;
  entityName: string | null;
  exchangeName: string | null;
  isContract: boolean;
  verificationStatus: VerificationStatus;
  riskScore: number;
  trustScore: number;
  scamReportsCount: number;
}

export interface WalletDetail extends WalletSummary {
  labels: WalletLabel[];
  firstSeenAt: string | null;
  lastActiveAt: string | null;
  txCount: number;
  tokenHoldingsCount: number;
  nftHoldingsCount: number;
  connectedChains: Chain[];
  holdings: TokenHolding[];
  nfts: NftHolding[];
  activity: WalletActivity[];
  aiSummary: AiRiskSummary;
}

export interface AiRiskSummary {
  headline: string;
  body: string;
  confidence: 'low' | 'medium' | 'high';
  basedOnReports: number;
  generatedAt: string;
}

export interface ScamReportSummary {
  id: string;
  walletAddress: string;
  chain: Chain;
  category: ScamCategory;
  description: string;
  transactionHash: string | null;
  websiteUrl: string | null;
  socialMediaUrl: string | null;
  incidentDate: string | null;
  status: ReportStatus;
  upvotes: number;
  downvotes: number;
  commentsCount: number;
  createdAt: string;
  reporterUsername: string | null;
}

export interface PlatformStats {
  totalWalletsIndexed: number;
  totalScamReports: number;
  totalVerifiedWallets: number;
  totalUsers: number;
  reportsThisWeek: number;
  chainsSupported: number;
}
