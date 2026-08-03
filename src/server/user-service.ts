import { prisma } from '@/lib/prisma';
import { USE_LIVE_DATABASE } from './data-source';
import { MOCK_USERS, type MockUser } from '@/lib/mock-data';

export async function getAllUsers(): Promise<MockUser[]> {
  if (!USE_LIVE_DATABASE) return MOCK_USERS;

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  return users.map((u) => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    status: u.status,
    reputation: u.reputation,
    createdAt: u.createdAt.toISOString(),
  }));
}
