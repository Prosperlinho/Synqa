'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Role } from '@/types';

interface AccountSettingsFormProps {
  username: string;
  email: string;
  role: Role;
}

export function AccountSettingsForm({ username: initialUsername, email: initialEmail, role }: AccountSettingsFormProps) {
  const [username, setUsername] = React.useState(initialUsername);
  const [email, setEmail] = React.useState(initialEmail);
  const [newPassword, setNewPassword] = React.useState('');
  const [savingProfile, setSavingProfile] = React.useState(false);
  const [savingPassword, setSavingPassword] = React.useState(false);

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingProfile(true);
    try {
      const response = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Unable to update your profile.');

      setEmail(result.email ?? email);
      toast.success(result.email !== email ? 'Profile saved. Check your inbox to confirm the new email.' : 'Profile saved.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update your profile.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPassword(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword('');
      toast.success('Password updated.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update your password.');
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" required minLength={2} maxLength={32} className="mt-1.5" value={username} onChange={(event) => setUsername(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="account-email">Email</Label>
          <Input id="account-email" type="email" required className="mt-1.5" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Input id="role" className="mt-1.5 uppercase" value={role} readOnly aria-readonly="true" />
        </div>
        <Button type="submit" disabled={savingProfile} className="w-fit">
          {savingProfile && <Loader2 className="h-4 w-4 animate-spin" />}
          Save profile
        </Button>
      </form>

      <div className="border-t border-border/70 pt-8">
        <h2 className="font-display text-lg font-semibold mb-1">Change password</h2>
        <p className="text-sm text-muted-foreground mb-4">Use at least six characters for your new password.</p>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="new-password">New password</Label>
            <Input id="new-password" type="password" required minLength={6} className="mt-1.5" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          </div>
          <Button type="submit" variant="outline" disabled={savingPassword} className="w-fit">
            {savingPassword && <Loader2 className="h-4 w-4 animate-spin" />}
            Update password
          </Button>
        </form>
      </div>
    </div>
  );
}