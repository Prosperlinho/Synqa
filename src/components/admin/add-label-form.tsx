'use client';

import * as React from 'react';
import { Tag, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function AddLabelForm() {
  const [walletAddress, setWalletAddress] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [confidence, setConfidence] = React.useState(90);
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/labels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, label, confidence }),
      });
      if (!res.ok) throw new Error();
      toast.success('Label added to wallet');
      setWalletAddress('');
      setLabel('');
    } catch {
      toast.error('Failed to add label — check admin permissions');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2"><Tag className="h-4 w-4" /> Add a verified label</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="grid sm:grid-cols-[2fr_2fr_1fr_auto] gap-3 items-end">
          <div>
            <Label>Wallet address</Label>
            <Input className="font-mono mt-1.5" placeholder="0x… or ENS" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} required />
          </div>
          <div>
            <Label>Label</Label>
            <Input className="mt-1.5" placeholder="e.g. Binance Hot Wallet 22" value={label} onChange={(e) => setLabel(e.target.value)} required />
          </div>
          <div>
            <Label>Confidence</Label>
            <Input type="number" min={0} max={100} className="mt-1.5" value={confidence} onChange={(e) => setConfidence(Number(e.target.value))} />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Add label
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
