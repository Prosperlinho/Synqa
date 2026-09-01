import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const username = typeof body?.username === 'string' ? body.username.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (username.length < 2 || username.length > 32) {
    return NextResponse.json({ error: 'Username must be between 2 and 32 characters.' }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.updateUser({ email, data: { username } });
    if (authError) throw authError;

    const profileEmail = authData.user.email ?? user.email;
    await prisma.user.update({ where: { id: user.id }, data: { username, email: profileEmail, updatedAt: new Date() } });
    return NextResponse.json({ username, email: profileEmail });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to update your profile.' }, { status: 500 });
  }
}