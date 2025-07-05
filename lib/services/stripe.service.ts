import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { PaymentStatus, SubscriptionType, PayoutStatus, CommissionStatus } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Validation schemas
const CreatePaymentIntentSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().default('eur'),
  bookingId: z.string(),
  customerId: z.string().optional(),
  paymentMethodId: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

const CreateSubscriptionSchema = z.object({
  customerId: z.string(),
  priceId: z.string(),
  subscriptionType: z.nativeEnum(SubscriptionType),
  trialDays: z.number().optional(),
  metadata: z.record(z.string()).optional(),
});

const CreatePayoutSchema = z.object({
  userId: z.string(),
  amount: z.number().min(1),
  currency: z.string().default('eur'),
  method: z.string().default('bank_transfer'),
  metadata: z.record(z.string()).optional(),
});

export class StripeService {
  private static instance: StripeService;
  private platformFeeRate = 0.15; // 15% platform fee
  private stripeFeeRate = 0.029; // 2.9% + 0.30€ Stripe fee
  private stripeFeeFixed = 0.30;

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  /**
   * Create a payment intent for booking
   */
  async createPaymentIntent(data: z.infer<typeof CreatePaymentIntentSchema>) {
    try {
      const validatedData = CreatePaymentIntentSchema.parse(data);
      
      // Calculate fees
      const platformFee = Math.round(validatedData.amount * this.platformFeeRate);
      const stripeFee = Math.round(validatedData.amount * this.stripeFeeRate + this.stripeFeeFixed * 100);
      const netAmount = validatedData.amount - platformFee - stripeFee;

      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: validatedData.amount,
        currency: validatedData.currency,
        customer: validatedData.customerId,
        payment_method: validatedData.paymentMethodId,
        confirmation_method: 'automatic',
        capture_method: 'automatic',
        metadata: {
          ...validatedData.metadata,
          bookingId: validatedData.bookingId,
          platformFee: platformFee.toString(),
          stripeFee: stripeFee.toString(),
          netAmount: netAmount.toString(),
        },
      });

      // Update payment in database
      await prisma.payment.upsert({
        where: { bookingId: validatedData.bookingId },
        update: {
          amount: validatedData.amount / 100, // Convert to euros
          platformFee: platformFee / 100,
          stripeFee: stripeFee / 100,
          netAmount: netAmount / 100,
          status: PaymentStatus.PENDING,
          stripeId: paymentIntent.id,
          paymentIntentId: paymentIntent.id,
        },
        create: {
          bookingId: validatedData.bookingId,
          amount: validatedData.amount / 100,
          currency: validatedData.currency.toUpperCase(),
          platformFee: platformFee / 100,
          stripeFee: stripeFee / 100,
          netAmount: netAmount / 100,
          status: PaymentStatus.PENDING,
          paymentMethod: 'stripe',
          stripeId: paymentIntent.id,
          paymentIntentId: paymentIntent.id,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: validatedData.amount,
        fees: {
          platformFee,
          stripeFee,
          netAmount,
        },
      };
    } catch (error) {
      console.error('[StripeService] Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Create a subscription
   */
  async createSubscription(data: z.infer<typeof CreateSubscriptionSchema>) {
    try {
      const validatedData = CreateSubscriptionSchema.parse(data);

      // Get price details
      const price = await stripe.prices.retrieve(validatedData.priceId);
      const subscriptionData: Stripe.SubscriptionCreateParams = {
        customer: validatedData.customerId,
        items: [{ price: validatedData.priceId }],
        metadata: {
          ...validatedData.metadata,
          subscriptionType: validatedData.subscriptionType,
        },
        expand: ['latest_invoice.payment_intent'],
      };

      // Add trial period if specified
      if (validatedData.trialDays) {
        subscriptionData.trial_period_days = validatedData.trialDays;
      }

      const subscription = await stripe.subscriptions.create(subscriptionData);

      // Update subscription in database
      const user = await prisma.user.findFirst({
        where: { 
          accounts: { some: { providerAccountId: validatedData.customerId } } 
        },
      });

      if (user) {
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            type: validatedData.subscriptionType,
            price: (price.unit_amount || 0) / 100,
            currency: price.currency?.toUpperCase() || 'EUR',
            billingCycle: price.recurring?.interval || 'month',
            stripeId: subscription.id,
            stripeStatus: subscription.status,
            isActive: subscription.status === 'active',
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000),
            ...(validatedData.trialDays && {
              trialStart: new Date(subscription.trial_start! * 1000),
              trialEnd: new Date(subscription.trial_end! * 1000),
            }),
          },
          create: {
            userId: user.id,
            type: validatedData.subscriptionType,
            price: (price.unit_amount || 0) / 100,
            currency: price.currency?.toUpperCase() || 'EUR',
            billingCycle: price.recurring?.interval || 'month',
            stripeId: subscription.id,
            stripeStatus: subscription.status,
            isActive: subscription.status === 'active',
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000),
            ...(validatedData.trialDays && {
              trialStart: new Date(subscription.trial_start! * 1000),
              trialEnd: new Date(subscription.trial_end! * 1000),
            }),
          },
        });
      }

      return {
        subscriptionId: subscription.id,
        status: subscription.status,
        clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
      };
    } catch (error) {
      console.error('[StripeService] Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Create a payout to escort's bank account
   */
  async createPayout(data: z.infer<typeof CreatePayoutSchema>) {
    try {
      const validatedData = CreatePayoutSchema.parse(data);

      // Get user's connected account
      const user = await prisma.user.findUnique({
        where: { id: validatedData.userId },
        include: { digitalWallet: true },
      });

      if (!user || !user.digitalWallet || !user.digitalWallet.isVerified) {
        throw new Error('User wallet not found or not verified');
      }

      // Check available balance
      if (user.digitalWallet.availableEarnings < validatedData.amount) {
        throw new Error('Insufficient balance');
      }

      // Calculate payout fee (2% + 0.25€)
      const payoutFee = Math.max(validatedData.amount * 0.02, 0.25);
      const netAmount = validatedData.amount - payoutFee;

      // Create payout in database first
      const payout = await prisma.payout.create({
        data: {
          userId: validatedData.userId,
          amount: validatedData.amount,
          currency: validatedData.currency.toUpperCase(),
          fee: payoutFee,
          netAmount: netAmount,
          status: PayoutStatus.PENDING,
          paymentMethod: validatedData.method,
          requestedAt: new Date(),
        },
      });

      // Update wallet balance
      await prisma.digitalWallet.update({
        where: { userId: validatedData.userId },
        data: {
          availableEarnings: {
            decrement: validatedData.amount,
          },
          totalWithdrawn: {
            increment: validatedData.amount,
          },
        },
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId: validatedData.userId,
          type: 'PAYOUT',
          amount: -validatedData.amount,
          currency: validatedData.currency.toUpperCase(),
          status: PaymentStatus.PENDING,
          description: `Payout to ${validatedData.method}`,
          payoutId: payout.id,
          platformFee: payoutFee,
          netAmount: -netAmount,
        },
      });

      return {
        payoutId: payout.id,
        amount: validatedData.amount,
        fee: payoutFee,
        netAmount: netAmount,
        status: PayoutStatus.PENDING,
      };
    } catch (error) {
      console.error('[StripeService] Error creating payout:', error);
      throw new Error('Failed to create payout');
    }
  }

  /**
   * Calculate and create commission
   */
  async calculateCommission(bookingId: string, amount: number, commissionRate: number = 0.10) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { client: true, escort: true },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      const commissionAmount = amount * commissionRate;

      // Create commission record
      const commission = await prisma.commission.create({
        data: {
          payerId: booking.clientId,
          recipientId: booking.escortId,
          bookingId: bookingId,
          baseAmount: amount,
          rate: commissionRate,
          amount: commissionAmount,
          currency: 'EUR',
          status: CommissionStatus.CALCULATED,
          type: 'booking',
          description: `Commission for booking ${bookingId}`,
          calculatedAt: new Date(),
        },
      });

      return commission;
    } catch (error) {
      console.error('[StripeService] Error calculating commission:', error);
      throw new Error('Failed to calculate commission');
    }
  }

  /**
   * Process webhook events
   */
  async processWebhook(body: string, signature: string) {
    try {
      const event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'invoice.payment_succeeded':
          await this.handleSubscriptionPaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;
        
        default:
          console.log(`[StripeService] Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('[StripeService] Webhook error:', error);
      throw new Error('Webhook processing failed');
    }
  }

  private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    try {
      const bookingId = paymentIntent.metadata.bookingId;
      
      // Update payment status
      await prisma.payment.update({
        where: { stripeId: paymentIntent.id },
        data: {
          status: PaymentStatus.COMPLETED,
          paidAt: new Date(),
        },
      });

      // Update booking status
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });

      // Calculate and create commission
      const amount = paymentIntent.amount / 100;
      await this.calculateCommission(bookingId, amount);

      // Update escort's earnings
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { escort: { include: { digitalWallet: true } } },
      });

      if (booking?.escort) {
        const escortEarnings = amount * (1 - this.platformFeeRate);
        
        await prisma.digitalWallet.upsert({
          where: { userId: booking.escort.id },
          update: {
            totalEarnings: { increment: escortEarnings },
            availableEarnings: { increment: escortEarnings },
          },
          create: {
            userId: booking.escort.id,
            totalEarnings: escortEarnings,
            availableEarnings: escortEarnings,
          },
        });
      }

      console.log(`[StripeService] Payment succeeded for booking ${bookingId}`);
    } catch (error) {
      console.error('[StripeService] Error handling payment success:', error);
    }
  }

  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    try {
      const bookingId = paymentIntent.metadata.bookingId;
      
      // Update payment status
      await prisma.payment.update({
        where: { stripeId: paymentIntent.id },
        data: { status: PaymentStatus.FAILED },
      });

      // Update booking status
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CANCELLED' },
      });

      console.log(`[StripeService] Payment failed for booking ${bookingId}`);
    } catch (error) {
      console.error('[StripeService] Error handling payment failure:', error);
    }
  }

  private async handleSubscriptionPaymentSucceeded(invoice: Stripe.Invoice) {
    try {
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
      
      // Update subscription in database
      await prisma.subscription.updateMany({
        where: { stripeId: subscription.id },
        data: {
          stripeStatus: subscription.status,
          isActive: subscription.status === 'active',
          startDate: new Date(subscription.current_period_start * 1000),
          endDate: new Date(subscription.current_period_end * 1000),
        },
      });

      console.log(`[StripeService] Subscription payment succeeded: ${subscription.id}`);
    } catch (error) {
      console.error('[StripeService] Error handling subscription payment:', error);
    }
  }

  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    try {
      // Update subscription in database
      await prisma.subscription.updateMany({
        where: { stripeId: subscription.id },
        data: {
          stripeStatus: subscription.status,
          isActive: subscription.status === 'active',
          startDate: new Date(subscription.current_period_start * 1000),
          endDate: new Date(subscription.current_period_end * 1000),
          ...(subscription.canceled_at && {
            canceledAt: new Date(subscription.canceled_at * 1000),
          }),
        },
      });

      console.log(`[StripeService] Subscription updated: ${subscription.id}`);
    } catch (error) {
      console.error('[StripeService] Error handling subscription update:', error);
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    try {
      // Update subscription in database
      await prisma.subscription.updateMany({
        where: { stripeId: subscription.id },
        data: {
          stripeStatus: 'canceled',
          isActive: false,
          canceledAt: new Date(),
        },
      });

      console.log(`[StripeService] Subscription deleted: ${subscription.id}`);
    } catch (error) {
      console.error('[StripeService] Error handling subscription deletion:', error);
    }
  }

  /**
   * Get customer portal URL
   */
  async createCustomerPortalSession(customerId: string, returnUrl: string) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return session.url;
    } catch (error) {
      console.error('[StripeService] Error creating customer portal session:', error);
      throw new Error('Failed to create customer portal session');
    }
  }

  /**
   * Get subscription pricing
   */
  async getSubscriptionPricing() {
    try {
      const prices = await stripe.prices.list({
        active: true,
        expand: ['data.product'],
      });

      return prices.data.map(price => ({
        id: price.id,
        productId: price.product,
        amount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        metadata: price.metadata,
      }));
    } catch (error) {
      console.error('[StripeService] Error getting subscription pricing:', error);
      throw new Error('Failed to get subscription pricing');
    }
  }
}

export default StripeService.getInstance(); 