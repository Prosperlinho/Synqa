import { redirect } from 'next/navigation';
import { UserRound } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { AccountSettingsForm } from '@/components/account/account-settings-form';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login?next=/account');

  return (
    <div className="container py-10 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <UserRound className="h-5 w-5 text-primary" />
          <h1 className="font-display text-2xl font-semibold">Account settings</h1>
        </div>
        <p className="text-sm text-muted-foreground">Manage your profile and sign-in details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Update the information shown on your Synqa account.</CardDescription>
        </CardHeader>
        <CardContent>
          <AccountSettingsForm username={user.username} email={user.email} role={user.role} />
        </CardContent>
      </Card>
    </div>
  );
}