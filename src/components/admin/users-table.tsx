'use client';

import * as React from 'react';
import { Ban, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { formatNumber } from '@/lib/utils';
import { toast } from 'sonner';
import type { MockUser } from '@/lib/mock-data';

const ROLE_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  ADMIN: 'default',
  MODERATOR: 'secondary',
  USER: 'outline',
};

export function UsersTable({ initialUsers }: { initialUsers: MockUser[] }) {
  const [users, setUsers] = React.useState(initialUsers);
  const [target, setTarget] = React.useState<MockUser | null>(null);
  const [reason, setReason] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  async function confirmBan() {
    if (!target) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/users/${target.id}/ban`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: target.id, reason }),
      });
      if (!res.ok) throw new Error();
      setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, status: 'BANNED' } : u)));
      toast.success(`${target.username} has been banned`);
      setTarget(null);
      setReason('');
    } catch {
      toast.error('Action failed — check admin permissions');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Reputation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-8 w-8"><AvatarFallback>{u.username.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                  <div>
                    <p className="font-medium text-sm">{u.username}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell><Badge variant={ROLE_VARIANT[u.role]}>{u.role}</Badge></TableCell>
              <TableCell>
                <Badge variant={u.status === 'ACTIVE' ? 'trust' : u.status === 'SUSPENDED' ? 'riskMedium' : 'destructive'}>
                  {u.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-tabular">{formatNumber(u.reputation)}</TableCell>
              <TableCell className="text-right">
                {u.status === 'BANNED' ? (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Banned</span>
                ) : (
                  <Button size="sm" variant="destructive" onClick={() => setTarget(u)}>
                    <Ban className="h-3.5 w-3.5" /> Ban
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!target} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban {target?.username}?</DialogTitle>
            <DialogDescription>This immediately restricts the user from reporting, voting, and commenting. Logged to the audit trail.</DialogDescription>
          </DialogHeader>
          <Textarea placeholder="Reason for ban (required)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setTarget(null)}>Cancel</Button>
            <Button variant="destructive" disabled={reason.trim().length < 5 || submitting} onClick={confirmBan}>
              Confirm ban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
