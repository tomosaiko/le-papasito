import { PrismaClient } from '@prisma/client';
import { PaymentStatus, PayoutStatus, TransactionType } from '@prisma/client';
import { z } from 'zod';
import StripeService from './stripe.service';

const prisma = new PrismaClient();

// Validation schemas
const CreateWalletSchema = z.object({
  userId: z.string(),
  bankAccountName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankRoutingNumber: z.string().optional(),
  bankSwiftCode: z.string().optional(),
});

const WithdrawSchema = z.object({
  userId: z.string(),
  amount: z.number().min(50), // Minimum withdrawal 50€
  paymentMethod: z.enum(['bank_transfer', 'paypal', 'crypto']),
  bankDetails: z.object({
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    swiftCode: z.string().optional(),
  }).optional(),
});

const TransactionSchema = z.object({
  userId: z.string(),
  type: z.nativeEnum(TransactionType),
  amount: z.number(),
  currency: z.string().default('EUR'),
  description: z.string().optional(),
  reference: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export class WalletService {
  private static instance: WalletService;
  private readonly minimumWithdrawal = 50; // 50€ minimum
  private readonly withdrawalFeeRate = 0.02; // 2% fee
  private readonly withdrawalFeeMin = 0.25; // 0.25€ minimum fee

  public static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  /**
   * Create or update a digital wallet
   */
  async createWallet(data: z.infer<typeof CreateWalletSchema>) {
    try {
      const validatedData = CreateWalletSchema.parse(data);

      const wallet = await prisma.digitalWallet.upsert({
        where: { userId: validatedData.userId },
        update: {
          bankAccountName: validatedData.bankAccountName,
          bankAccountNumber: validatedData.bankAccountNumber,
          bankRoutingNumber: validatedData.bankRoutingNumber,
          bankSwiftCode: validatedData.bankSwiftCode,
          isActive: true,
        },
        create: {
          userId: validatedData.userId,
          balance: 0,
          totalEarnings: 0,
          availableEarnings: 0,
          pendingEarnings: 0,
          totalWithdrawn: 0,
          minimumWithdrawal: this.minimumWithdrawal,
          bankAccountName: validatedData.bankAccountName,
          bankAccountNumber: validatedData.bankAccountNumber,
          bankRoutingNumber: validatedData.bankRoutingNumber,
          bankSwiftCode: validatedData.bankSwiftCode,
          isActive: true,
          isVerified: false,
        },
      });

      return wallet;
    } catch (error) {
      console.error('[WalletService] Error creating wallet:', error);
      throw new Error('Failed to create wallet');
    }
  }

  /**
   * Get wallet information
   */
  async getWallet(userId: string) {
    try {
      const wallet = await prisma.digitalWallet.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!wallet) {
        // Create wallet if it doesn't exist
        return await this.createWallet({ userId });
      }

      return wallet;
    } catch (error) {
      console.error('[WalletService] Error getting wallet:', error);
      throw new Error('Failed to get wallet');
    }
  }

  /**
   * Add earnings to wallet
   */
  async addEarnings(userId: string, amount: number, source: string, metadata?: Record<string, any>) {
    try {
      const wallet = await this.getWallet(userId);

      // Update wallet balance
      const updatedWallet = await prisma.digitalWallet.update({
        where: { userId },
        data: {
          balance: { increment: amount },
          totalEarnings: { increment: amount },
          availableEarnings: { increment: amount },
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.PAYMENT,
          amount,
          currency: 'EUR',
          status: PaymentStatus.COMPLETED,
          description: `Earnings from ${source}`,
          reference: source,
          metadata,
          completedAt: new Date(),
        },
      });

      return updatedWallet;
    } catch (error) {
      console.error('[WalletService] Error adding earnings:', error);
      throw new Error('Failed to add earnings');
    }
  }

  /**
   * Request withdrawal
   */
  async requestWithdrawal(data: z.infer<typeof WithdrawSchema>) {
    try {
      const validatedData = WithdrawSchema.parse(data);

      const wallet = await this.getWallet(validatedData.userId);

      // Validate withdrawal
      if (!wallet.isActive) {
        throw new Error('Wallet is not active');
      }

      if (!wallet.isVerified) {
        throw new Error('Wallet is not verified. Please complete verification first.');
      }

      if (validatedData.amount < this.minimumWithdrawal) {
        throw new Error(`Minimum withdrawal amount is ${this.minimumWithdrawal}€`);
      }

      if (validatedData.amount > wallet.availableEarnings) {
        throw new Error('Insufficient balance');
      }

      // Calculate withdrawal fee
      const withdrawalFee = Math.max(
        validatedData.amount * this.withdrawalFeeRate,
        this.withdrawalFeeMin
      );
      const netAmount = validatedData.amount - withdrawalFee;

      // Create payout using Stripe service
      const payout = await StripeService.createPayout({
        userId: validatedData.userId,
        amount: validatedData.amount,
        currency: 'eur',
        method: validatedData.paymentMethod,
        metadata: {
          fee: withdrawalFee.toString(),
          netAmount: netAmount.toString(),
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId: validatedData.userId,
          type: TransactionType.WITHDRAWAL,
          amount: -validatedData.amount,
          currency: 'EUR',
          status: PaymentStatus.PENDING,
          description: `Withdrawal via ${validatedData.paymentMethod}`,
          reference: payout.payoutId,
          platformFee: withdrawalFee,
          netAmount: -netAmount,
          metadata: {
            payoutId: payout.payoutId,
            paymentMethod: validatedData.paymentMethod,
          },
        },
      });

      return payout;
    } catch (error) {
      console.error('[WalletService] Error requesting withdrawal:', error);
      throw new Error('Failed to request withdrawal');
    }
  }

  /**
   * Get wallet transactions
   */
  async getTransactions(userId: string, limit = 50, offset = 0) {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      const totalCount = await prisma.transaction.count({
        where: { userId },
      });

      return {
        transactions,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
      };
    } catch (error) {
      console.error('[WalletService] Error getting transactions:', error);
      throw new Error('Failed to get transactions');
    }
  }

  /**
   * Get wallet statistics
   */
  async getWalletStats(userId: string, period: 'week' | 'month' | 'year' = 'month') {
    try {
      const wallet = await this.getWallet(userId);

      // Calculate date range
      const now = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // Get transactions for the period
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: now,
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Calculate statistics
      const earnings = transactions
        .filter(t => t.type === TransactionType.PAYMENT && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const withdrawals = transactions
        .filter(t => t.type === TransactionType.WITHDRAWAL && t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      const commissions = transactions
        .filter(t => t.type === TransactionType.COMMISSION)
        .reduce((sum, t) => sum + t.amount, 0);

      const fees = transactions
        .reduce((sum, t) => sum + (t.platformFee || 0), 0);

      // Get pending payouts
      const pendingPayouts = await prisma.payout.findMany({
        where: {
          userId,
          status: PayoutStatus.PENDING,
        },
      });

      const pendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0);

      return {
        wallet: {
          balance: wallet.balance,
          totalEarnings: wallet.totalEarnings,
          availableEarnings: wallet.availableEarnings,
          pendingEarnings: wallet.pendingEarnings,
          totalWithdrawn: wallet.totalWithdrawn,
        },
        period: {
          earnings,
          withdrawals,
          commissions,
          fees,
          netEarnings: earnings - fees,
        },
        pending: {
          payouts: pendingPayouts.length,
          amount: pendingAmount,
        },
        transactions: transactions.length,
      };
    } catch (error) {
      console.error('[WalletService] Error getting wallet stats:', error);
      throw new Error('Failed to get wallet statistics');
    }
  }

  /**
   * Get all payouts for a user
   */
  async getPayouts(userId: string, limit = 20, offset = 0) {
    try {
      const payouts = await prisma.payout.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      const totalCount = await prisma.payout.count({
        where: { userId },
      });

      return {
        payouts,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount,
        },
      };
    } catch (error) {
      console.error('[WalletService] Error getting payouts:', error);
      throw new Error('Failed to get payouts');
    }
  }

  /**
   * Verify wallet (admin function)
   */
  async verifyWallet(userId: string, verified: boolean, adminNotes?: string) {
    try {
      const wallet = await prisma.digitalWallet.update({
        where: { userId },
        data: {
          isVerified: verified,
        },
      });

      // Create transaction record for verification
      await prisma.transaction.create({
        data: {
          userId,
          type: TransactionType.BONUS,
          amount: 0,
          currency: 'EUR',
          status: PaymentStatus.COMPLETED,
          description: verified ? 'Wallet verified' : 'Wallet verification revoked',
          reference: 'admin_verification',
          metadata: {
            adminNotes,
            verificationStatus: verified ? 'verified' : 'revoked',
          },
          completedAt: new Date(),
        },
      });

      return wallet;
    } catch (error) {
      console.error('[WalletService] Error verifying wallet:', error);
      throw new Error('Failed to verify wallet');
    }
  }

  /**
   * Get wallet balance summary
   */
  async getBalanceSummary(userId: string) {
    try {
      const wallet = await this.getWallet(userId);

      // Get pending commissions
      const pendingCommissions = await prisma.commission.findMany({
        where: {
          recipientId: userId,
          status: 'CALCULATED',
        },
      });

      const pendingCommissionAmount = pendingCommissions.reduce((sum, c) => sum + c.amount, 0);

      // Get recent transactions
      const recentTransactions = await prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      return {
        currentBalance: wallet.balance,
        availableEarnings: wallet.availableEarnings,
        pendingEarnings: wallet.pendingEarnings,
        totalEarnings: wallet.totalEarnings,
        totalWithdrawn: wallet.totalWithdrawn,
        pendingCommissions: pendingCommissionAmount,
        minimumWithdrawal: wallet.minimumWithdrawal,
        isVerified: wallet.isVerified,
        isActive: wallet.isActive,
        recentTransactions,
      };
    } catch (error) {
      console.error('[WalletService] Error getting balance summary:', error);
      throw new Error('Failed to get balance summary');
    }
  }

  /**
   * Process commission payment
   */
  async processCommissionPayment(commissionId: string) {
    try {
      const commission = await prisma.commission.findUnique({
        where: { id: commissionId },
        include: {
          recipient: true,
          payer: true,
        },
      });

      if (!commission) {
        throw new Error('Commission not found');
      }

      if (commission.status !== 'CALCULATED') {
        throw new Error('Commission is not ready for payment');
      }

      // Add earnings to recipient's wallet
      await this.addEarnings(
        commission.recipientId,
        commission.amount,
        'commission',
        {
          commissionId: commission.id,
          bookingId: commission.bookingId,
          subscriptionId: commission.subscriptionId,
        }
      );

      // Update commission status
      await prisma.commission.update({
        where: { id: commissionId },
        data: {
          status: 'PAID',
          paidAt: new Date(),
        },
      });

      return commission;
    } catch (error) {
      console.error('[WalletService] Error processing commission payment:', error);
      throw new Error('Failed to process commission payment');
    }
  }

  /**
   * Get earnings forecast
   */
  async getEarningsForecast(userId: string) {
    try {
      // Get historical earnings data
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const earnings = await prisma.transaction.findMany({
        where: {
          userId,
          type: TransactionType.PAYMENT,
          amount: { gt: 0 },
          createdAt: { gte: thirtyDaysAgo },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Calculate daily average
      const totalEarnings = earnings.reduce((sum, t) => sum + t.amount, 0);
      const dailyAverage = totalEarnings / 30;

      // Get pending bookings (future earnings)
      const pendingBookings = await prisma.booking.findMany({
        where: {
          escortId: userId,
          status: 'CONFIRMED',
          date: { gte: new Date() },
        },
      });

      const pendingEarnings = pendingBookings.reduce((sum, b) => sum + b.totalAmount, 0);

      return {
        dailyAverage,
        weeklyForecast: dailyAverage * 7,
        monthlyForecast: dailyAverage * 30,
        pendingEarnings,
        totalForecast: dailyAverage * 30 + pendingEarnings,
      };
    } catch (error) {
      console.error('[WalletService] Error getting earnings forecast:', error);
      throw new Error('Failed to get earnings forecast');
    }
  }
}

export default WalletService.getInstance(); 