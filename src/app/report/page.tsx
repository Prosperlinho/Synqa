import { Suspense } from 'react';
import { ReportForm } from '@/components/report/report-form';
import { ShieldAlert } from 'lucide-react';

export default function ReportPage() {
  return (
    <div className="container py-12 max-w-2xl">
      <div className="flex items-center gap-2 mb-2">
        <ShieldAlert className="h-5 w-5 text-risk-high" />
        <h1 className="font-display text-2xl font-semibold">Report a scam wallet</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        Help protect the community by submitting evidence against a scam or malicious wallet.
        Every submission is reviewed by a moderator before it becomes public.
      </p>
      <Suspense>
        <ReportForm />
      </Suspense>
    </div>
  );
}
