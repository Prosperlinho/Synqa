'use client';

import * as React from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Renders Cloudflare Turnstile when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 * Falls back to a manual "verify" button in local/demo environments so the
 * report flow is still testable without provisioning a site key.
 */
export function CaptchaWidget({ onVerify }: { onVerify: (token: string) => void }) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [verified, setVerified] = React.useState(false);

  if (siteKey) {
    return <Turnstile siteKey={siteKey} onSuccess={onVerify} options={{ theme: 'auto' }} />;
  }

  return (
    <Button
      type="button"
      variant={verified ? 'trust' : 'outline'}
      onClick={() => {
        setVerified(true);
        onVerify('dev-mode-token');
      }}
      className="w-fit"
    >
      <ShieldCheck className="h-4 w-4" />
      {verified ? 'Verified' : "I'm not a robot (dev mode)"}
    </Button>
  );
}
