'use client';

import * as React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function VoteButtons({
  reportId,
  initialUpvotes,
  initialDownvotes,
}: {
  reportId: string;
  initialUpvotes: number;
  initialDownvotes: number;
}) {
  const [vote, setVote] = React.useState<'UP' | 'DOWN' | null>(null);
  const [upvotes, setUpvotes] = React.useState(initialUpvotes);
  const [downvotes, setDownvotes] = React.useState(initialDownvotes);
  const [pending, setPending] = React.useState(false);

  async function castVote(value: 'UP' | 'DOWN') {
    if (pending) return;
    setPending(true);

    const previous = vote;
    // optimistic update
    if (previous === value) {
      setVote(null);
      value === 'UP' ? setUpvotes((v) => v - 1) : setDownvotes((v) => v - 1);
    } else {
      if (previous === 'UP') setUpvotes((v) => v - 1);
      if (previous === 'DOWN') setDownvotes((v) => v - 1);
      setVote(value);
      value === 'UP' ? setUpvotes((v) => v + 1) : setDownvotes((v) => v + 1);
    }

    try {
      const res = await fetch(`/api/reports/${reportId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error('Sign in to vote on reports');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn('h-8 px-2', vote === 'UP' && 'text-trust bg-trust/10')}
        onClick={() => castVote('UP')}
      >
        <ThumbsUp className="h-3.5 w-3.5" /> {upvotes}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn('h-8 px-2', vote === 'DOWN' && 'text-destructive bg-destructive/10')}
        onClick={() => castVote('DOWN')}
      >
        <ThumbsDown className="h-3.5 w-3.5" /> {downvotes}
      </Button>
    </div>
  );
}
