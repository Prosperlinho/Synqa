import { Info } from 'lucide-react';

export function DemoModeBanner() {
  return (
    <div className="mb-6 flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
      <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
      <p className="text-muted-foreground">
        Running in demo mode with sample data (no <code className="font-mono">DATABASE_URL</code> configured).
        In production this page is gated behind <code className="font-mono">requireAdmin()</code> /
        <code className="font-mono"> requireModeratorOrAdmin()</code> and every action writes to
        <code className="font-mono"> AdminLog</code>.
      </p>
    </div>
  );
}
