'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-24 text-center max-w-sm mx-auto">
      <AlertTriangle className="h-10 w-10 mx-auto mb-4 text-risk-high" />
      <h1 className="font-display text-xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-sm text-muted-foreground mb-6">
        This section failed to load. You can try again, or head back home.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
