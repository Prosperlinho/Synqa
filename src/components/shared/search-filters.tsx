'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CHAIN_LIST } from '@/config/chains';

export function SearchFilters() {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = React.useState(params.get('q') ?? '');
  const [chain, setChain] = React.useState(params.get('chain') ?? 'all');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams();
    if (query.trim()) next.set('q', query.trim());
    if (chain !== 'all') next.set('chain', chain);
    router.push(`/search?${next.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Address, ENS, domain, exchange, or entity name…"
          className="pl-9 font-mono text-sm h-11"
        />
      </div>
      <Select value={chain} onValueChange={setChain}>
        <SelectTrigger className="sm:w-48 h-11">
          <SelectValue placeholder="All chains" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All chains</SelectItem>
          {CHAIN_LIST.map((c) => (
            <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" size="lg" className="h-11">Search</Button>
    </form>
  );
}
