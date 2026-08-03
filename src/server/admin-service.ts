import { prisma } from '@/lib/prisma';
import { USE_LIVE_DATABASE } from './data-source';

export async function approveReport(reportId: string, actorId: string, note?: string) {
  if (!USE_LIVE_DATABASE) return { id: reportId, status: 'APPROVED' as const };

  const report = await prisma.$transaction(async (tx) => {
    const updated = await tx.scamReport.update({
      where: { id: reportId },
      data: { status: 'APPROVED', moderatedById: actorId, moderationNote: note },
    });
    await tx.adminLog.create({
      data: {
        actorId,
        action: 'APPROVE_REPORT',
        targetType: 'REPORT',
        targetId: reportId,
        metadata: { note },
      },
    });
    // Recompute wallet risk/trust after a report becomes public — kept in the
    // wallet-service scoring function so this stays the single source of truth.
    return updated;
  });

  return { id: report.id, status: report.status };
}

export async function rejectReport(reportId: string, actorId: string, note?: string) {
  if (!USE_LIVE_DATABASE) return { id: reportId, status: 'REJECTED' as const };

  const report = await prisma.$transaction(async (tx) => {
    const updated = await tx.scamReport.update({
      where: { id: reportId },
      data: { status: 'REJECTED', moderatedById: actorId, moderationNote: note },
    });
    await tx.adminLog.create({
      data: { actorId, action: 'REJECT_REPORT', targetType: 'REPORT', targetId: reportId, metadata: { note } },
    });
    return updated;
  });

  return { id: report.id, status: report.status };
}

export async function flagFalseReport(reportId: string, actorId: string, note?: string) {
  if (!USE_LIVE_DATABASE) return { id: reportId, status: 'FLAGGED_FALSE' as const };

  const report = await prisma.$transaction(async (tx) => {
    const updated = await tx.scamReport.update({
      where: { id: reportId },
      data: { status: 'FLAGGED_FALSE', moderatedById: actorId, moderationNote: note },
    });
    await tx.adminLog.create({
      data: { actorId, action: 'FLAG_FALSE_REPORT', targetType: 'REPORT', targetId: reportId, metadata: { note } },
    });
    return updated;
  });

  return { id: report.id, status: report.status };
}

export async function addWalletLabel(
  walletId: string,
  label: string,
  confidence: number,
  actorId: string
) {
  if (!USE_LIVE_DATABASE) return { id: `mock_label_${Date.now()}`, label };

  const created = await prisma.$transaction(async (tx) => {
    const newLabel = await tx.walletLabel.create({
      data: { walletId, label, confidence, source: 'ADMIN', addedById: actorId },
    });
    await tx.adminLog.create({
      data: { actorId, action: 'ADD_LABEL', targetType: 'WALLET', targetId: walletId, metadata: { label } },
    });
    return newLabel;
  });

  return created;
}

export async function banUser(userId: string, actorId: string, reason: string) {
  if (!USE_LIVE_DATABASE) return { id: userId, status: 'BANNED' as const };

  const user = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({ where: { id: userId }, data: { status: 'BANNED' } });
    await tx.adminLog.create({
      data: { actorId, action: 'BAN_USER', targetType: 'USER', targetId: userId, metadata: { reason } },
    });
    return updated;
  });

  return { id: user.id, status: user.status };
}

export async function getAdminDashboardCounts() {
  if (!USE_LIVE_DATABASE) {
    return { pending: 3, approved: 61204, rejected: 812, flaggedFalse: 44, totalUsers: 88412, totalWallets: 4218930 };
  }

  const [pending, approved, rejected, flaggedFalse, totalUsers, totalWallets] = await Promise.all([
    prisma.scamReport.count({ where: { status: 'PENDING' } }),
    prisma.scamReport.count({ where: { status: 'APPROVED' } }),
    prisma.scamReport.count({ where: { status: 'REJECTED' } }),
    prisma.scamReport.count({ where: { status: 'FLAGGED_FALSE' } }),
    prisma.user.count(),
    prisma.wallet.count(),
  ]);

  return { pending, approved, rejected, flaggedFalse, totalUsers, totalWallets };
}
