import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container py-24 text-center max-w-md mx-auto">
      <SearchX className="h-10 w-10 mx-auto mb-4 text-muted-foreground opacity-60" />
      <h1 className="font-display text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-sm text-muted-foreground mb-6">
        The page you&apos;re looking for doesn&apos;t exist. If you were searching for a
        wallet address, try the search page instead.
      </p>
      <div className="flex justify-center gap-3">
        <Button asChild variant="outline"><Link href="/">Go home</Link></Button>
        <Button asChild><Link href="/search">Search wallets</Link></Button>
      </div>
    </div>
  );
}
