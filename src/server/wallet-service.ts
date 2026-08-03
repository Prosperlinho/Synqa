import { prisma } from '@/lib/prisma';
import { USE_LIVE_DATABASE } from './data-source';
import {
  findMockWalletByAddress,
  searchMockWallets,
  MOCK_TRENDING_SCAMS,
  MOCK_RECENTLY_VERIFIED,
} from '@/lib/mock-data';
import { computeWalletScores } from '@/lib/risk-engine';
import { generateAiRiskSummary } from '@/lib/ai-summary';
import type { WalletDetail, WalletSummary, Chain } from '@/types';

export async function getWalletByAddress(address: string, chain?: Chain): Promise<WalletDetail | null> {
  if (!USE_LIVE_DATABASE) {
    return findMockWalletByAddress(address) ?? null;
  }

  const wallet = await prisma.wallet.findFirst({
    where: {
      addressLower: address.trim().toLowerCase(),
      ...(chain ? { chain } : {}),
    },
    include: {
      labels: true,
      holdings: true,
      nfts: true,
      connectedChains: true,
      activity: { orderBy: { occurredAt: 'desc' }, take: 25 },
      scamReports: { where: { status: 'APPROVED' } },
    },
  });

  if (!wallet) return null;

  const approvedReports = wallet.scamReports;
  const scores = computeWalletScores({
    approvedReportsCount: approvedReports.length,
    pendingReportsCount: await prisma.scamReport.count({ where: { walletId: wallet.id, status: 'PENDING' } }),
    flaggedFalseReportsCount: await prisma.scamReport.count({ where: { walletId: wallet.id, status: 'FLAGGED_FALSE' } }),
    isOfficiallyVerified: wallet.verificationStatus === 'OFFICIALLY_VERIFIED',
    isCommunityVerified: wallet.verificationStatus === 'COMMUNITY_VERIFIED',
    accountAgeDays: wallet.firstSeenAt
      ? Math.floor((Date.now() - wallet.firstSeenAt.getTime()) / (1000 * 60 * 60 * 24))
      : null,
    txCount: wallet.txCount,
    hasKnownMaliciousLabel: wallet.labels.some((l) => /phishing|scam|malicious|rug/i.test(l.label)),
    isKnownExchangeOrEntity: !!wallet.entityName,
  });

  const distinctCategories = [...new Set(approvedReports.map((r) => r.category))];

  const aiSummary = generateAiRiskSummary({
    walletLabel: wallet.ens ?? wallet.address,
    approvedReportsCount: approvedReports.length,
    categories: distinctCategories,
    isOfficiallyVerified: wallet.verificationStatus === 'OFFICIALLY_VERIFIED',
    isCommunityVerified: wallet.verificationStatus === 'COMMUNITY_VERIFIED',
    entityName: wallet.entityName,
    riskScore: scores.riskScore,
  });

  return {
    id: wallet.id,
    address: wallet.address,
    chain: wallet.chain,
    ens: wallet.ens,
    walletType: wallet.walletType,
    entityName: wallet.entityName,
    exchangeName: wallet.exchangeName,
    isContract: wallet.isContract,
    verificationStatus: wallet.verificationStatus,
    riskScore: scores.riskScore,
    trustScore: scores.trustScore,
    scamReportsCount: approvedReports.length,
    labels: wallet.labels.map((l) => ({ id: l.id, label: l.label, source: l.source, confidence: l.confidence })),
    firstSeenAt: wallet.firstSeenAt?.toISOString() ?? null,
    lastActiveAt: wallet.lastActiveAt?.toISOString() ?? null,
    txCount: wallet.txCount,
    tokenHoldingsCount: wallet.tokenHoldingsCount,
    nftHoldingsCount: wallet.nftHoldingsCount,
    connectedChains: wallet.connectedChains.map((c) => c.chain),
    holdings: wallet.holdings.map((h) => ({
      id: h.id,
      tokenSymbol: h.tokenSymbol,
      tokenName: h.tokenName,
      balance: h.balance,
      usdValue: h.usdValue,
    })),
    nfts: wallet.nfts.map((n) => ({
      id: n.id,
      collection: n.collection,
      tokenId: n.tokenId,
      imageUrl: n.imageUrl,
      floorPriceUsd: n.floorPriceUsd,
    })),
    activity: wallet.activity.map((a) => ({
      id: a.id,
      txHash: a.txHash,
      direction: a.direction as 'IN' | 'OUT' | 'CONTRACT_CALL',
      counterparty: a.counterparty,
      valueUsd: a.valueUsd,
      occurredAt: a.occurredAt.toISOString(),
    })),
    aiSummary,
  };
}

export async function searchWallets(query: string, chain?: Chain): Promise<WalletSummary[]> {
  if (!USE_LIVE_DATABASE) {
    return searchMockWallets(query);
  }

  const wallets = await prisma.wallet.findMany({
    where: {
      ...(chain ? { chain } : {}),
      OR: [
        { addressLower: { contains: query.toLowerCase() } },
        { ens: { contains: query, mode: 'insensitive' } },
        { entityName: { contains: query, mode: 'insensitive' } },
        { exchangeName: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: 25,
    include: { scamReports: { where: { status: 'APPROVED' } } },
  });

  return wallets.map((w) => ({
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
    scamReportsCount: w.scamReports.length,
  }));
}

export async function getTrendingScamWallets(): Promise<WalletSummary[]> {
  if (!USE_LIVE_DATABASE) return MOCK_TRENDING_SCAMS;

  const wallets = await prisma.wallet.findMany({
    where: { riskScore: { gte: 55 } },
    orderBy: { riskScore: 'desc' },
    take: 8,
    include: { scamReports: { where: { status: 'APPROVED' } } },
  });

  return wallets.map((w) => ({
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
    scamReportsCount: w.scamReports.length,
  }));
}

export async function getRecentlyVerifiedWallets(): Promise<WalletSummary[]> {
  if (!USE_LIVE_DATABASE) return MOCK_RECENTLY_VERIFIED;

  const wallets = await prisma.wallet.findMany({
    where: { verificationStatus: { in: ['OFFICIALLY_VERIFIED', 'COMMUNITY_VERIFIED'] } },
    orderBy: { updatedAt: 'desc' },
    take: 8,
    include: { scamReports: { where: { status: 'APPROVED' } } },
  });

  return wallets.map((w) => ({
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
    scamReportsCount: w.scamReports.length,
  }));
}
