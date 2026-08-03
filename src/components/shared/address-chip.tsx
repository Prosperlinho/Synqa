'use client';

import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { truncateAddress, cn } from '@/lib/utils';

export function AddressChip({
  address,
  truncate = true,
  className,
}: {
  address: string;
  truncate?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  async function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API may be unavailable (e.g. insecure context) — fail silently.
    }
  }

  return (
    <button onClick={handleCopy} className={cn('addr-chip hover:bg-muted transition-colors', className)} type="button">
      {truncate ? truncateAddress(address) : address}
      {copied ? <Check className="h-3 w-3 text-trust" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
    </button>
  );
}
