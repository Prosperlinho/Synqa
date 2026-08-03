'use client';

import * as React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatRelativeDate } from '@/lib/utils';
import { toast } from 'sonner';

export interface CommentItem {
  id: string;
  author: string;
  body: string;
  createdAt: string;
}

export function CommentSection({
  reportId,
  initialComments = [],
}: {
  reportId: string;
  initialComments?: CommentItem[];
}) {
  const [comments, setComments] = React.useState<CommentItem[]>(initialComments);
  const [draft, setDraft] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/reports/${reportId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: draft.trim(), reportId }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setComments((prev) => [
        { id: data.id, author: 'you', body: draft.trim(), createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setDraft('');
    } catch {
      toast.error('Sign in to comment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-5">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add relevant context or evidence…"
          className="min-h-[44px] h-11 py-2.5"
        />
        <Button type="submit" size="icon" disabled={submitting} className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex flex-col gap-4">
        {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet.</p>}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{c.author.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{c.author}</span>
                <span className="text-xs text-muted-foreground">{formatRelativeDate(c.createdAt)}</span>
              </div>
              <p className="text-sm text-foreground/90 mt-0.5">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
