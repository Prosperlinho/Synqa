import { z } from 'zod';

export const chainEnum = z.enum([
  'ETHEREUM',
  'BNB_CHAIN',
  'SOLANA',
  'BASE',
  'ARBITRUM',
  'POLYGON',
  'AVALANCHE',
  'OPTIMISM',
  'TRON',
]);

export const scamCategoryEnum = z.enum([
  'PHISHING',
  'RUG_PULL',
  'FAKE_GIVEAWAY',
  'IMPERSONATION',
  'ROMANCE_SCAM',
  'PONZI_SCHEME',
  'MALICIOUS_CONTRACT',
  'ADDRESS_POISONING',
  'FAKE_SUPPORT',
  'EXCHANGE_SCAM',
  'NFT_SCAM',
  'OTHER',
]);

export const searchQuerySchema = z.object({
  query: z
    .string()
    .trim()
    .min(3, 'Enter at least 3 characters')
    .max(120, 'Query is too long'),
  chain: chainEnum.optional(),
});

// Scam report submission. Kept intentionally strict: every field that could
// be used to fabricate an accusation is either validated or capped in length.
export const scamReportSchema = z.object({
  walletAddress: z
    .string()
    .trim()
    .min(4, 'Wallet address is required')
    .max(128, 'Address is too long'),
  chain: chainEnum,
  category: scamCategoryEnum,
  description: z
    .string()
    .trim()
    .min(40, 'Please describe the incident in at least 40 characters')
    .max(4000, 'Description is too long (max 4000 characters)'),
  transactionHash: z.string().trim().max(128).optional().or(z.literal('')),
  websiteUrl: z.string().trim().url('Enter a valid URL').max(300).optional().or(z.literal('')),
  socialMediaUrl: z.string().trim().url('Enter a valid URL').max(300).optional().or(z.literal('')),
  incidentDate: z.string().optional(),
  captchaToken: z.string().min(1, 'Please complete the verification challenge'),
});

export type ScamReportInput = z.infer<typeof scamReportSchema>;

export const commentSchema = z.object({
  body: z.string().trim().min(2).max(2000),
  walletId: z.string().min(1).optional(),
  reportId: z.string().min(1).optional(),
  parentId: z.string().min(1).optional(),
});

export const voteSchema = z.object({
  reportId: z.string().min(1),
  value: z.enum(['UP', 'DOWN']),
});

export const walletLabelSchema = z.object({
  walletId: z.string().min(1),
  label: z.string().trim().min(2).max(80),
  confidence: z.number().min(0).max(100).default(80),
});

export const moderationDecisionSchema = z.object({
  reportId: z.string().min(1),
  note: z.string().trim().max(500).optional(),
});

export const banUserSchema = z.object({
  userId: z.string().min(1),
  reason: z.string().trim().min(5).max(500),
});
