/*
  Warnings:

  - You are about to drop the column `commission` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `paymentId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `payments` table. All the data in the column will be lost.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[stripeId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hourlyRate` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netAmount` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CommissionStatus" AS ENUM ('PENDING', 'CALCULATED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('PAYMENT', 'REFUND', 'COMMISSION', 'PAYOUT', 'SUBSCRIPTION', 'BONUS', 'WITHDRAWAL');

-- DropIndex
DROP INDEX "bookings_paymentId_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "commission",
DROP COLUMN "paymentId",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "hourlyRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "location" TEXT;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "transactionId",
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "netAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paymentData" JSONB,
ADD COLUMN     "paymentIntentId" TEXT,
ADD COLUMN     "platformFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "stripeFee" DOUBLE PRECISION NOT NULL DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "billingCycle" TEXT NOT NULL DEFAULT 'monthly',
ADD COLUMN     "cancelAt" TIMESTAMP(3),
ADD COLUMN     "cancelReason" TEXT,
ADD COLUMN     "canceledAt" TIMESTAMP(3),
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'EUR',
ADD COLUMN     "features" JSONB,
ADD COLUMN     "limits" JSONB,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "stripeStatus" TEXT,
ADD COLUMN     "trialEnd" TIMESTAMP(3),
ADD COLUMN     "trialStart" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "bookingId" TEXT,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "netAmount" DOUBLE PRECISION,
ADD COLUMN     "paymentIntentId" TEXT,
ADD COLUMN     "payoutId" TEXT,
ADD COLUMN     "platformFee" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "processedAt" TIMESTAMP(3),
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "stripeFee" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "stripeId" TEXT,
ADD COLUMN     "subscriptionId" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "TransactionType" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "digital_wallets" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "availableEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pendingEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalWithdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minimumWithdrawal" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "bankAccountName" TEXT,
    "bankAccountNumber" TEXT,
    "bankRoutingNumber" TEXT,
    "bankSwiftCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "digital_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payouts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netAmount" DOUBLE PRECISION NOT NULL,
    "status" "PayoutStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT NOT NULL,
    "paymentData" JSONB,
    "stripePayoutId" TEXT,
    "transactionId" TEXT,
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commissions" (
    "id" TEXT NOT NULL,
    "payerId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "bookingId" TEXT,
    "subscriptionId" TEXT,
    "baseAmount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "CommissionStatus" NOT NULL DEFAULT 'PENDING',
    "calculatedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "type" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "commissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_events" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT,
    "previousData" JSONB,
    "currentData" JSONB,
    "stripeEventId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subscription_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "digital_wallets_userId_key" ON "digital_wallets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "payouts_stripePayoutId_key" ON "payouts"("stripePayoutId");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_events_stripeEventId_key" ON "subscription_events"("stripeEventId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_stripeId_key" ON "transactions"("stripeId");

-- CreateIndex
CREATE INDEX "transactions_userId_type_idx" ON "transactions"("userId", "type");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");

-- AddForeignKey
ALTER TABLE "digital_wallets" ADD CONSTRAINT "digital_wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commissions" ADD CONSTRAINT "commissions_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
