-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');

-- CreateEnum
CREATE TYPE "Chain" AS ENUM ('ETHEREUM', 'BNB_CHAIN', 'SOLANA', 'BASE', 'ARBITRUM', 'POLYGON', 'AVALANCHE', 'OPTIMISM', 'TRON');

-- CreateEnum
CREATE TYPE "WalletType" AS ENUM ('PERSONAL', 'CONTRACT', 'EXCHANGE', 'BRIDGE', 'MIXER', 'CONTRACT_PROXY', 'MULTISIG', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'COMMUNITY_VERIFIED', 'OFFICIALLY_VERIFIED', 'FLAGGED_SCAM');

-- CreateEnum
CREATE TYPE "LabelSource" AS ENUM ('ADMIN', 'COMMUNITY', 'PARTNER_FEED', 'HEURISTIC');

-- CreateEnum
CREATE TYPE "ScamCategory" AS ENUM ('PHISHING', 'RUG_PULL', 'FAKE_GIVEAWAY', 'IMPERSONATION', 'ROMANCE_SCAM', 'PONZI_SCHEME', 'MALICIOUS_CONTRACT', 'ADDRESS_POISONING', 'FAKE_SUPPORT', 'EXCHANGE_SCAM', 'NFT_SCAM', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED_FALSE');

-- CreateEnum
CREATE TYPE "VoteValue" AS ENUM ('UP', 'DOWN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('WALLET_NEW_REPORT', 'WALLET_SCORE_CHANGE', 'REPORT_STATUS_CHANGE', 'COMMENT_REPLY', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AdminAction" AS ENUM ('APPROVE_REPORT', 'REJECT_REPORT', 'FLAG_FALSE_REPORT', 'ADD_LABEL', 'REMOVE_LABEL', 'BAN_USER', 'SUSPEND_USER', 'REINSTATE_USER', 'EDIT_WALLET_SCORE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "reputation" INTEGER NOT NULL DEFAULT 0,
    "walletAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "addressLower" TEXT NOT NULL,
    "chain" "Chain" NOT NULL,
    "ens" TEXT,
    "walletType" "WalletType" NOT NULL DEFAULT 'UNKNOWN',
    "entityName" TEXT,
    "exchangeName" TEXT,
    "isContract" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "trustScore" INTEGER NOT NULL DEFAULT 50,
    "firstSeenAt" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3),
    "txCount" INTEGER NOT NULL DEFAULT 0,
    "tokenHoldingsCount" INTEGER NOT NULL DEFAULT 0,
    "nftHoldingsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletConnectedChain" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "chain" "Chain" NOT NULL,

    CONSTRAINT "WalletConnectedChain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletLabel" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "source" "LabelSource" NOT NULL DEFAULT 'COMMUNITY',
    "addedById" TEXT,
    "confidence" INTEGER NOT NULL DEFAULT 80,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletScoreHistory" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "riskScore" INTEGER NOT NULL,
    "trustScore" INTEGER NOT NULL,
    "reason" TEXT,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletScoreHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenHolding" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "tokenSymbol" TEXT NOT NULL,
    "tokenName" TEXT NOT NULL,
    "balance" TEXT NOT NULL,
    "usdValue" DOUBLE PRECISION,
    "contractAddr" TEXT,

    CONSTRAINT "TokenHolding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NftHolding" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "collection" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "imageUrl" TEXT,
    "floorPriceUsd" DOUBLE PRECISION,

    CONSTRAINT "NftHolding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletActivity" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "counterparty" TEXT,
    "valueUsd" DOUBLE PRECISION,
    "occurredAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScamReport" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "reporterId" TEXT,
    "category" "ScamCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "transactionHash" TEXT,
    "websiteUrl" TEXT,
    "socialMediaUrl" TEXT,
    "incidentDate" TIMESTAMP(3),
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "moderatedById" TEXT,
    "moderationNote" TEXT,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScamReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileSizeKb" INTEGER,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "walletId" TEXT,
    "reportId" TEXT,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,
    "body" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "value" "VoteValue" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletFollow" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "alertOnNewReport" BOOLEAN NOT NULL DEFAULT true,
    "alertOnScoreChange" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletFollow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" "AdminAction" NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_supabaseId_key" ON "User"("supabaseId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "Wallet_addressLower_idx" ON "Wallet"("addressLower");

-- CreateIndex
CREATE INDEX "Wallet_entityName_idx" ON "Wallet"("entityName");

-- CreateIndex
CREATE INDEX "Wallet_riskScore_idx" ON "Wallet"("riskScore");

-- CreateIndex
CREATE INDEX "Wallet_verificationStatus_idx" ON "Wallet"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_addressLower_chain_key" ON "Wallet"("addressLower", "chain");

-- CreateIndex
CREATE UNIQUE INDEX "WalletConnectedChain_walletId_chain_key" ON "WalletConnectedChain"("walletId", "chain");

-- CreateIndex
CREATE INDEX "WalletLabel_walletId_idx" ON "WalletLabel"("walletId");

-- CreateIndex
CREATE INDEX "WalletLabel_label_idx" ON "WalletLabel"("label");

-- CreateIndex
CREATE INDEX "WalletScoreHistory_walletId_recordedAt_idx" ON "WalletScoreHistory"("walletId", "recordedAt");

-- CreateIndex
CREATE INDEX "TokenHolding_walletId_idx" ON "TokenHolding"("walletId");

-- CreateIndex
CREATE INDEX "NftHolding_walletId_idx" ON "NftHolding"("walletId");

-- CreateIndex
CREATE INDEX "WalletActivity_walletId_occurredAt_idx" ON "WalletActivity"("walletId", "occurredAt");

-- CreateIndex
CREATE INDEX "ScamReport_walletId_idx" ON "ScamReport"("walletId");

-- CreateIndex
CREATE INDEX "ScamReport_status_idx" ON "ScamReport"("status");

-- CreateIndex
CREATE INDEX "ScamReport_category_idx" ON "ScamReport"("category");

-- CreateIndex
CREATE INDEX "Evidence_reportId_idx" ON "Evidence"("reportId");

-- CreateIndex
CREATE INDEX "Comment_walletId_idx" ON "Comment"("walletId");

-- CreateIndex
CREATE INDEX "Comment_reportId_idx" ON "Comment"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_reportId_userId_key" ON "Vote"("reportId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_userId_walletId_key" ON "Bookmark"("userId", "walletId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletFollow_userId_walletId_key" ON "WalletFollow"("userId", "walletId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "AdminLog_actorId_idx" ON "AdminLog"("actorId");

-- CreateIndex
CREATE INDEX "AdminLog_targetType_targetId_idx" ON "AdminLog"("targetType", "targetId");

-- AddForeignKey
ALTER TABLE "WalletConnectedChain" ADD CONSTRAINT "WalletConnectedChain_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletLabel" ADD CONSTRAINT "WalletLabel_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletScoreHistory" ADD CONSTRAINT "WalletScoreHistory_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TokenHolding" ADD CONSTRAINT "TokenHolding_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NftHolding" ADD CONSTRAINT "NftHolding_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletActivity" ADD CONSTRAINT "WalletActivity_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScamReport" ADD CONSTRAINT "ScamReport_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScamReport" ADD CONSTRAINT "ScamReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "ScamReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "ScamReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "ScamReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletFollow" ADD CONSTRAINT "WalletFollow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletFollow" ADD CONSTRAINT "WalletFollow_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminLog" ADD CONSTRAINT "AdminLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
