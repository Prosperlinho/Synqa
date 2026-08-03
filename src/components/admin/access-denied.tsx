import { ShieldOff } from 'lucide-react';

export function AccessDenied({ message = 'You need admin or moderator access to view this page.' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <ShieldOff className="h-8 w-8 text-muted-foreground mb-3" />
      <h2 className="font-display text-lg font-semibold mb-1">Access denied</h2>
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
    </div>
  );
}
