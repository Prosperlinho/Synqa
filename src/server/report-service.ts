import { prisma } from '@/lib/prisma';
import { USE_LIVE_DATABASE } from './data-source';
import { MOCK_LATEST_REPORTS } from '@/lib/mock-data';
import type { ScamReportInput } from '@/lib/validation';
import type { ScamReportSummary } from '@/types';

export async function getReportsForWallet(walletAddress: string, walletId?: string): Promise<ScamReportSummary[]> {
  if (!USE_LIVE_DATABASE) {
    return MOCK_LATEST_REPORTS.filter(
      (r) => r.walletAddress.toLowerCase() === walletAddress.toLowerCase() && r.status === 'APPROVED'
    );
  }

  if (!walletId) return [];

  const reports = await prisma.scamReport.findMany({
    where: { walletId, status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    include: { wallet: true, reporter: true, votes: true, comments: true },
  });

  return reports.map(toSummary);
}

export async function getLatestApprovedReports(limit = 6): Promise<ScamReportSummary[]> {
  if (!USE_LIVE_DATABASE) return MOCK_LATEST_REPORTS.slice(0, limit);

  const reports = await prisma.scamReport.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { wallet: true, reporter: true, votes: true, comments: true },
  });

  return reports.map(toSummary);
}

export async function getPendingReports() {
  if (!USE_LIVE_DATABASE) return MOCK_LATEST_REPORTS.filter((r) => r.status === 'PENDING');

  const reports = await prisma.scamReport.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
    include: { wallet: true, reporter: true, evidence: true, votes: true, comments: true },
  });

  return reports.map(toSummary);
}

function toSummary(r: any): ScamReportSummary {
  return {
    id: r.id,
    walletAddress: r.wallet?.address ?? r.walletAddress,
    chain: r.wallet?.chain ?? r.chain,
    category: r.category,
    description: r.description,
    transactionHash: r.transactionHash,
    websiteUrl: r.websiteUrl,
    socialMediaUrl: r.socialMediaUrl,
    incidentDate: r.incidentDate ? new Date(r.incidentDate).toISOString() : null,
    status: r.status,
    upvotes: r.votes ? r.votes.filter((v: any) => v.value === 'UP').length : 0,
    downvotes: r.votes ? r.votes.filter((v: any) => v.value === 'DOWN').length : 0,
    commentsCount: r.comments?.length ?? 0,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
    reporterUsername: r.reporter?.username ?? null,
  };
}

/**
 * Creates a new scam report in PENDING status. Always requires moderation
 * before it becomes public — see requirements in the brief. Never
 * auto-approves regardless of reporter reputation.
 */
export async function createScamReport(input: ScamReportInput, reporterId: string | null, ipHash: string) {
  if (!USE_LIVE_DATABASE) {
    // Demo mode: no-op persistence, just echo back what would be created.
    return {
      id: `mock_${Date.now()}`,
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    };
  }

  let wallet = await prisma.wallet.findFirst({
    where: { addressLower: input.walletAddress.toLowerCase(), chain: input.chain },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        address: input.walletAddress,
        addressLower: input.walletAddress.toLowerCase(),
        chain: input.chain,
        walletType: 'UNKNOWN',
        verificationStatus: 'UNVERIFIED',
      },
    });
  }

  const report = await prisma.scamReport.create({
    data: {
      walletId: wallet.id,
      reporterId: reporterId ?? undefined,
      category: input.category,
      description: input.description,
      transactionHash: input.transactionHash || null,
      websiteUrl: input.websiteUrl || null,
      socialMediaUrl: input.socialMediaUrl || null,
      incidentDate: input.incidentDate ? new Date(input.incidentDate) : null,
      status: 'PENDING',
      ipHash,
    },
  });

  return { id: report.id, status: report.status, createdAt: report.createdAt.toISOString() };
}
