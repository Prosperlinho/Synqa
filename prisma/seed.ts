import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding TrustWallet AI database…');

  // --- Users ---------------------------------------------------------------
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trustwallet.ai' },
    update: {},
    create: {
      supabaseId: 'seed-admin-uuid',
      username: 'admin_root',
      email: 'admin@trustwallet.ai',
      role: 'ADMIN',
      reputation: 9999,
    },
  });

  const moderator = await prisma.user.upsert({
    where: { email: 'sleuth@example.com' },
    update: {},
    create: {
      supabaseId: 'seed-mod-uuid',
      username: 'onchain_sleuth',
      email: 'sleuth@example.com',
      role: 'MODERATOR',
      reputation: 4820,
    },
  });

  const reporter = await prisma.user.upsert({
    where: { email: 'watchdog@example.com' },
    update: {},
    create: {
      supabaseId: 'seed-user-uuid',
      username: 'defi_watchdog',
      email: 'watchdog@example.com',
      role: 'USER',
      reputation: 2210,
    },
  });

  // --- Wallets ---------------------------------------------------------------
  const binance = await prisma.wallet.upsert({
    where: { addressLower_chain: { addressLower: '0x28c6c06298d514db089934071355e5743bf21d60', chain: 'ETHEREUM' } },
    update: {},
    create: {
      address: '0x28C6c06298d514Db089934071355E5743bf21d60',
      addressLower: '0x28c6c06298d514db089934071355e5743bf21d60',
      chain: 'ETHEREUM',
      walletType: 'EXCHANGE',
      entityName: 'Binance',
      exchangeName: 'Binance Hot Wallet 14',
      isContract: false,
      verificationStatus: 'OFFICIALLY_VERIFIED',
      riskScore: 4,
      trustScore: 96,
      firstSeenAt: new Date('2019-04-11'),
      lastActiveAt: new Date(),
      txCount: 18_420_933,
      tokenHoldingsCount: 214,
      labels: { create: [{ label: 'Exchange Hot Wallet', source: 'PARTNER_FEED', confidence: 99, addedById: admin.id }] },
      connectedChains: { create: [{ chain: 'ETHEREUM' }, { chain: 'BNB_CHAIN' }] },
    },
  });

  const phishing = await prisma.wallet.upsert({
    where: { addressLower_chain: { addressLower: '0x00e1a3b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9', chain: 'ETHEREUM' } },
    update: {},
    create: {
      address: '0x00e1a3B2C4d5e6F7a8b9C0d1E2f3A4B5c6D7e8F9',
      addressLower: '0x00e1a3b2c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
      chain: 'ETHEREUM',
      ens: 'freeairdrop-claim.eth',
      walletType: 'PERSONAL',
      isContract: false,
      verificationStatus: 'FLAGGED_SCAM',
      riskScore: 92,
      trustScore: 3,
      firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
      lastActiveAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
      txCount: 341,
      labels: {
        create: [
          { label: 'Known Phishing', source: 'COMMUNITY', confidence: 95 },
          { label: 'Fake Airdrop Contract Interaction', source: 'HEURISTIC', confidence: 80 },
        ],
      },
      connectedChains: { create: [{ chain: 'ETHEREUM' }, { chain: 'BASE' }] },
    },
  });

  // --- Scam report -----------------------------------------------------------
  await prisma.scamReport.create({
    data: {
      walletId: phishing.id,
      reporterId: reporter.id,
      category: 'PHISHING',
      description:
        'Sent a fake "claim your airdrop" link via Discord DM impersonating a project moderator. Site prompted wallet connect then drained approvals.',
      transactionHash: '0x77fd12aa99e2b1c4d5e6f7a8b9c0d1e2f3a4b5c6',
      websiteUrl: 'https://freeairdrop-claim-example.com',
      status: 'APPROVED',
      moderatedById: moderator.id,
      ipHash: 'seed-hash-not-real',
    },
  });

  console.log('Seed complete:', { admin: admin.username, moderator: moderator.username, wallets: [binance.address, phishing.address] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
