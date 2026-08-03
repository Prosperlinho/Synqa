import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import type { Role } from '@/types';

export interface SessionUser {
  id: string;
  supabaseId: string;
  username: string;
  email: string;
  role: Role;
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED';
}

/**
 * Resolves the current request's app-level user (Supabase auth + Prisma profile).
 * Returns null (rather than throwing) whenever Supabase isn't configured yet or
 * there's no session — callers should treat null as "not signed in," not as an error.
 */
export async function getCurrentUser(): Promise<SessionUser | null> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null; // Supabase not provisioned yet — e.g. running the demo without credentials.
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const profile = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!profile) return null;

    return {
      id: profile.id,
      supabaseId: profile.supabaseId,
      username: profile.username,
      email: profile.email,
      role: profile.role,
      status: profile.status,
    };
  } catch {
    return null;
  }
}

export function requireRole(user: SessionUser | null, roles: Role[]): boolean {
  if (!user) return false;
  if (user.status !== 'ACTIVE') return false;
  return roles.includes(user.role);
}

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!requireRole(user, ['ADMIN'])) throw new UnauthorizedError('Admin access required');
  return user!;
}

export async function requireModeratorOrAdmin(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!requireRole(user, ['ADMIN', 'MODERATOR'])) throw new UnauthorizedError('Moderator access required');
  return user!;
}
