'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useRouter } from 'next/navigation';
import { scamReportSchema, type ScamReportInput } from '@/lib/validation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { EvidenceUpload } from '@/components/report/evidence-upload';
import { CaptchaWidget } from '@/components/report/captcha-widget';
import { CHAIN_LIST } from '@/config/chains';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const SCAM_CATEGORIES: { value: string; label: string }[] = [
  { value: 'PHISHING', label: 'Phishing' },
  { value: 'RUG_PULL', label: 'Rug pull' },
  { value: 'FAKE_GIVEAWAY', label: 'Fake giveaway' },
  { value: 'IMPERSONATION', label: 'Impersonation' },
  { value: 'ROMANCE_SCAM', label: 'Romance / pig-butchering scam' },
  { value: 'PONZI_SCHEME', label: 'Ponzi scheme' },
  { value: 'MALICIOUS_CONTRACT', label: 'Malicious contract' },
  { value: 'ADDRESS_POISONING', label: 'Address poisoning' },
  { value: 'FAKE_SUPPORT', label: 'Fake support agent' },
  { value: 'EXCHANGE_SCAM', label: 'Fake exchange' },
  { value: 'NFT_SCAM', label: 'NFT scam' },
  { value: 'OTHER', label: 'Other' },
];

export function ReportForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [evidenceFiles, setEvidenceFiles] = React.useState<File[]>([]);
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ScamReportInput>({
    resolver: zodResolver(scamReportSchema),
    defaultValues: {
      walletAddress: params.get('address') ?? '',
      chain: (params.get('chain') as ScamReportInput['chain']) ?? 'ETHEREUM',
      category: 'PHISHING',
      description: '',
      transactionHash: '',
      websiteUrl: '',
      socialMediaUrl: '',
      incidentDate: '',
      captchaToken: '',
    },
  });

  async function onSubmit(values: ScamReportInput) {
    try {
      // In production, evidence files upload to Supabase Storage first and the
      // resulting URLs are attached to the report payload before this POST.
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, evidenceFileCount: evidenceFiles.length }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Failed to submit report');
      }
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <CheckCircle2 className="h-10 w-10 mx-auto mb-4 text-trust" />
        <h2 className="font-display text-xl font-semibold mb-2">Report submitted for review</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
          Thank you. Your report is now in our moderation queue and will not appear publicly
          until a moderator confirms the evidence. This usually takes under 24 hours.
        </p>
        <Button variant="outline" onClick={() => router.push('/search')}>Search another wallet</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <div className="grid sm:grid-cols-[2fr_1fr] gap-4">
        <div>
          <Label htmlFor="walletAddress">Wallet address</Label>
          <Input id="walletAddress" className="font-mono mt-1.5" placeholder="0x… or ENS name" {...register('walletAddress')} />
          {errors.walletAddress && <p className="text-xs text-destructive mt-1">{errors.walletAddress.message}</p>}
        </div>
        <div>
          <Label htmlFor="chain">Blockchain</Label>
          <Controller
            control={control}
            name="chain"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CHAIN_LIST.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="category">Scam category</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {SCAM_CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label htmlFor="description">What happened?</Label>
        <Textarea
          id="description"
          className="mt-1.5 min-h-[140px]"
          placeholder="Describe the incident in detail: how contact was made, what was promised, what you sent, and any red flags you noticed."
          {...register('description')}
        />
        {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="transactionHash">Transaction hash <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input id="transactionHash" className="font-mono mt-1.5" placeholder="0x…" {...register('transactionHash')} />
        </div>
        <div>
          <Label htmlFor="incidentDate">Date of incident <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input id="incidentDate" type="date" className="mt-1.5" {...register('incidentDate')} />
        </div>
        <div>
          <Label htmlFor="websiteUrl">Website <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input id="websiteUrl" className="mt-1.5" placeholder="https://…" {...register('websiteUrl')} />
          {errors.websiteUrl && <p className="text-xs text-destructive mt-1">{errors.websiteUrl.message}</p>}
        </div>
        <div>
          <Label htmlFor="socialMediaUrl">Social media link <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input id="socialMediaUrl" className="mt-1.5" placeholder="https://x.com/…" {...register('socialMediaUrl')} />
          {errors.socialMediaUrl && <p className="text-xs text-destructive mt-1">{errors.socialMediaUrl.message}</p>}
        </div>
      </div>

      <div>
        <Label>Evidence upload <span className="text-muted-foreground font-normal">(optional but recommended)</span></Label>
        <div className="mt-1.5"><EvidenceUpload onChange={setEvidenceFiles} /></div>
      </div>

      <div>
        <Label>Verification</Label>
        <div className="mt-1.5">
          <CaptchaWidget onVerify={(token) => setValue('captchaToken', token, { shouldValidate: true })} />
        </div>
        {errors.captchaToken && <p className="text-xs text-destructive mt-1">{errors.captchaToken.message}</p>}
      </div>

      <p className="text-xs text-muted-foreground rounded-md bg-muted/60 p-3 leading-relaxed">
        All reports are reviewed by a moderator before becoming public. Submitting false reports
        may result in your account being restricted. Please only report addresses you have
        direct evidence against.
      </p>

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-fit">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit report for review
      </Button>
    </form>
  );
}
