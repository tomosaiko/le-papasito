import { PrismaClient } from '@prisma/client';
import { SubscriptionType } from '@prisma/client';
import { z } from 'zod';
import StripeService from './stripe.service';

const prisma = new PrismaClient();

// Subscription plans configuration
const SUBSCRIPTION_PLANS = {
  BASIC: {
    name: 'Basic',
    price: 0,
    features: {
      profileViews: 100,
      messagesSent: 50,
      photosUpload: 10,
      videosUpload: 0,
      featuredListing: false,
      prioritySupport: false,
      analyticsAccess: false,
      customBranding: false,
      apiAccess: false,
      commissionRate: 0.30, // 30% commission
    },
    limits: {
      dailyMessages: 10,
      monthlyBookings: 5,
      profileUpdates: 2,
    },
  },
  PREMIUM: {
    name: 'Premium',
    price: 29.99,
    features: {
      profileViews: 1000,
      messagesSent: 500,
      photosUpload: 50,
      videosUpload: 5,
      featuredListing: true,
      prioritySupport: true,
      analyticsAccess: true,
      customBranding: false,
      apiAccess: false,
      commissionRate: 0.25, // 25% commission
    },
    limits: {
      dailyMessages: 50,
      monthlyBookings: 20,
      profileUpdates: 10,
    },
  },
  VIP: {
    name: 'VIP',
    price: 99.99,
    features: {
      profileViews: -1, // Unlimited
      messagesSent: -1, // Unlimited
      photosUpload: -1, // Unlimited
      videosUpload: -1, // Unlimited
      featuredListing: true,
      prioritySupport: true,
      analyticsAccess: true,
      customBranding: true,
      apiAccess: true,
      commissionRate: 0.20, // 20% commission
    },
    limits: {
      dailyMessages: -1, // Unlimited
      monthlyBookings: -1, // Unlimited
      profileUpdates: -1, // Unlimited
    },
  },
};

// Validation schemas
const CreateSubscriptionSchema = z.object({
  userId: z.string(),
  type: z.nativeEnum(SubscriptionType),
  paymentMethodId: z.string().optional(),
  trialDays: z.number().optional(),
  metadata: z.record(z.string()).optional(),
});

const UpdateSubscriptionSchema = z.object({
  userId: z.string(),
  type: z.nativeEnum(SubscriptionType),
  cancelAtPeriodEnd: z.boolean().optional(),
  metadata: z.record(z.string()).optional(),
});

export class SubscriptionService {
  private static instance: SubscriptionService;

  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  /**
   * Get subscription plans
   */
  getPlans() {
    return SUBSCRIPTION_PLANS;
  }

  /**
   * Get plan by type
   */
  getPlan(type: SubscriptionType) {
    return SUBSCRIPTION_PLANS[type];
  }

  /**
   * Create a new subscription
   */
  async createSubscription(data: z.infer<typeof CreateSubscriptionSchema>) {
    try {
      const validatedData = CreateSubscriptionSchema.parse(data);
      const plan = this.getPlan(validatedData.type);

      // For free Basic plan, create subscription directly
      if (validatedData.type === SubscriptionType.BASIC) {
        const subscription = await prisma.subscription.upsert({
          where: { userId: validatedData.userId },
          update: {
            type: validatedData.type,
            price: plan.price,
            currency: 'EUR',
            billingCycle: 'monthly',
            isActive: true,
            startDate: new Date(),
            features: plan.features,
            limits: plan.limits,
          },
          create: {
            userId: validatedData.userId,
            type: validatedData.type,
            price: plan.price,
            currency: 'EUR',
            billingCycle: 'monthly',
            isActive: true,
            startDate: new Date(),
            features: plan.features,
            limits: plan.limits,
          },
        });

        return subscription;
      }

      // For paid plans, use Stripe
      const user = await prisma.user.findUnique({
        where: { id: validatedData.userId },
        include: { accounts: true },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get or create Stripe customer
      let customerId = user.accounts.find(a => a.provider === 'stripe')?.providerAccountId;
      
      if (!customerId) {
        // Create Stripe customer
        const customer = await StripeService.createCustomer({
          email: user.email,
          name: user.name,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;

        // Save customer ID in accounts
        await prisma.account.create({
          data: {
            userId: user.id,
            type: 'stripe',
            provider: 'stripe',
            providerAccountId: customerId,
          },
        });
      }

      // Create subscription with Stripe
      const stripeSubscription = await StripeService.createSubscription({
        customerId,
        priceId: `price_${validatedData.type.toLowerCase()}`, // This should be configured in Stripe
        subscriptionType: validatedData.type,
        trialDays: validatedData.trialDays,
        metadata: validatedData.metadata,
      });

      return stripeSubscription;
    } catch (error) {
      console.error('[SubscriptionService] Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Update subscription
   */
  async updateSubscription(data: z.infer<typeof UpdateSubscriptionSchema>) {
    try {
      const validatedData = UpdateSubscriptionSchema.parse(data);
      
      const currentSubscription = await prisma.subscription.findUnique({
        where: { userId: validatedData.userId },
      });

      if (!currentSubscription) {
        throw new Error('Subscription not found');
      }

      // If changing to BASIC, cancel current subscription
      if (validatedData.type === SubscriptionType.BASIC) {
        if (currentSubscription.stripeId) {
          await StripeService.cancelSubscription(currentSubscription.stripeId);
        }

        const plan = this.getPlan(SubscriptionType.BASIC);
        const subscription = await prisma.subscription.update({
          where: { userId: validatedData.userId },
          data: {
            type: SubscriptionType.BASIC,
            price: plan.price,
            isActive: true,
            features: plan.features,
            limits: plan.limits,
            stripeId: null,
            stripeStatus: null,
          },
        });

        return subscription;
      }

      // For paid plans, update Stripe subscription
      if (currentSubscription.stripeId) {
        await StripeService.updateSubscription(currentSubscription.stripeId, {
          priceId: `price_${validatedData.type.toLowerCase()}`,
          cancelAtPeriodEnd: validatedData.cancelAtPeriodEnd,
          metadata: validatedData.metadata,
        });
      } else {
        // Create new paid subscription
        return await this.createSubscription({
          userId: validatedData.userId,
          type: validatedData.type,
          metadata: validatedData.metadata,
        });
      }

      const plan = this.getPlan(validatedData.type);
      const subscription = await prisma.subscription.update({
        where: { userId: validatedData.userId },
        data: {
          type: validatedData.type,
          price: plan.price,
          features: plan.features,
          limits: plan.limits,
          ...(validatedData.cancelAtPeriodEnd && {
            cancelAt: currentSubscription.endDate,
          }),
        },
      });

      return subscription;
    } catch (error) {
      console.error('[SubscriptionService] Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(userId: string, cancelAtPeriodEnd: boolean = true) {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      // If has Stripe subscription, cancel it
      if (subscription.stripeId) {
        await StripeService.cancelSubscription(subscription.stripeId, cancelAtPeriodEnd);
      }

      // Update subscription in database
      const updatedSubscription = await prisma.subscription.update({
        where: { userId },
        data: {
          ...(cancelAtPeriodEnd ? {
            cancelAt: subscription.endDate,
          } : {
            isActive: false,
            canceledAt: new Date(),
          }),
        },
      });

      return updatedSubscription;
    } catch (error) {
      console.error('[SubscriptionService] Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Get user subscription
   */
  async getUserSubscription(userId: string) {
    try {
      const subscription = await prisma.subscription.findUnique({
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
          events: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
        },
      });

      if (!subscription) {
        // Create basic subscription for new users
        const basicPlan = this.getPlan(SubscriptionType.BASIC);
        return await prisma.subscription.create({
          data: {
            userId,
            type: SubscriptionType.BASIC,
            price: basicPlan.price,
            currency: 'EUR',
            billingCycle: 'monthly',
            isActive: true,
            startDate: new Date(),
            features: basicPlan.features,
            limits: basicPlan.limits,
          },
        });
      }

      return subscription;
    } catch (error) {
      console.error('[SubscriptionService] Error getting user subscription:', error);
      throw new Error('Failed to get user subscription');
    }
  }

  /**
   * Check if user has access to feature
   */
  async hasFeatureAccess(userId: string, feature: string): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      const features = subscription.features as any;
      
      return features[feature] === true || features[feature] === -1;
    } catch (error) {
      console.error('[SubscriptionService] Error checking feature access:', error);
      return false;
    }
  }

  /**
   * Check usage limits
   */
  async checkUsageLimit(userId: string, limitType: string, currentUsage: number): Promise<boolean> {
    try {
      const subscription = await this.getUserSubscription(userId);
      const limits = subscription.limits as any;
      const limit = limits[limitType];
      
      // -1 means unlimited
      if (limit === -1) return true;
      
      return currentUsage < limit;
    } catch (error) {
      console.error('[SubscriptionService] Error checking usage limit:', error);
      return false;
    }
  }

  /**
   * Get subscription usage statistics
   */
  async getUsageStats(userId: string) {
    try {
      const subscription = await this.getUserSubscription(userId);
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      // Get usage statistics
      const messagesSent = await prisma.message.count({
        where: {
          senderId: userId,
          createdAt: { gte: startOfMonth },
        },
      });

      const bookingsThisMonth = await prisma.booking.count({
        where: {
          escortId: userId,
          createdAt: { gte: startOfMonth },
        },
      });

      const messagesDaily = await prisma.message.count({
        where: {
          senderId: userId,
          createdAt: { gte: startOfDay },
        },
      });

      const profileUpdates = await prisma.user.count({
        where: {
          id: userId,
          updatedAt: { gte: startOfMonth },
        },
      });

      const limits = subscription.limits as any;
      const features = subscription.features as any;

      return {
        subscription: {
          type: subscription.type,
          isActive: subscription.isActive,
          features,
          limits,
        },
        usage: {
          messagesSent,
          messagesDaily,
          bookingsThisMonth,
          profileUpdates,
        },
        remaining: {
          messagesSent: limits.messagesSent === -1 ? -1 : Math.max(0, limits.messagesSent - messagesSent),
          messagesDaily: limits.dailyMessages === -1 ? -1 : Math.max(0, limits.dailyMessages - messagesDaily),
          bookingsThisMonth: limits.monthlyBookings === -1 ? -1 : Math.max(0, limits.monthlyBookings - bookingsThisMonth),
          profileUpdates: limits.profileUpdates === -1 ? -1 : Math.max(0, limits.profileUpdates - profileUpdates),
        },
      };
    } catch (error) {
      console.error('[SubscriptionService] Error getting usage stats:', error);
      throw new Error('Failed to get usage statistics');
    }
  }

  /**
   * Get subscription analytics
   */
  async getSubscriptionAnalytics(userId: string) {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription.features || !(subscription.features as any).analyticsAccess) {
        throw new Error('Analytics access not available in your plan');
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get profile views
      const profileViews = await prisma.analytics.count({
        where: {
          event: 'profile_view',
          data: {
            path: `/escorts/${userId}`,
          },
          createdAt: { gte: thirtyDaysAgo },
        },
      });

      // Get booking conversions
      const bookingAttempts = await prisma.analytics.count({
        where: {
          event: 'booking_attempt',
          data: {
            escortId: userId,
          },
          createdAt: { gte: thirtyDaysAgo },
        },
      });

      const confirmedBookings = await prisma.booking.count({
        where: {
          escortId: userId,
          status: 'CONFIRMED',
          createdAt: { gte: thirtyDaysAgo },
        },
      });

      const conversionRate = bookingAttempts > 0 ? (confirmedBookings / bookingAttempts) * 100 : 0;

      // Get revenue
      const revenue = await prisma.transaction.aggregate({
        where: {
          userId,
          type: 'PAYMENT',
          status: 'COMPLETED',
          createdAt: { gte: thirtyDaysAgo },
        },
        _sum: {
          amount: true,
        },
      });

      return {
        profileViews,
        bookingAttempts,
        confirmedBookings,
        conversionRate,
        revenue: revenue._sum.amount || 0,
        period: '30 days',
      };
    } catch (error) {
      console.error('[SubscriptionService] Error getting subscription analytics:', error);
      throw new Error('Failed to get subscription analytics');
    }
  }

  /**
   * Get commission rate for user
   */
  async getCommissionRate(userId: string): Promise<number> {
    try {
      const subscription = await this.getUserSubscription(userId);
      const features = subscription.features as any;
      
      return features.commissionRate || 0.15; // Default 15%
    } catch (error) {
      console.error('[SubscriptionService] Error getting commission rate:', error);
      return 0.15; // Default fallback
    }
  }

  /**
   * Get subscription events
   */
  async getSubscriptionEvents(userId: string, limit = 50) {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      const events = await prisma.subscriptionEvent.findMany({
        where: { subscriptionId: subscription.id },
        orderBy: { createdAt: 'desc' },
        take: limit,
      });

      return events;
    } catch (error) {
      console.error('[SubscriptionService] Error getting subscription events:', error);
      throw new Error('Failed to get subscription events');
    }
  }

  /**
   * Process subscription webhook
   */
  async processSubscriptionWebhook(eventType: string, data: any) {
    try {
      switch (eventType) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(data);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(data);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(data);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(data);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(data);
          break;
        default:
          console.log(`[SubscriptionService] Unhandled event: ${eventType}`);
      }
    } catch (error) {
      console.error('[SubscriptionService] Error processing webhook:', error);
      throw new Error('Failed to process subscription webhook');
    }
  }

  private async handleSubscriptionCreated(subscription: any) {
    // Log subscription creation event
    await prisma.subscriptionEvent.create({
      data: {
        subscriptionId: subscription.id,
        type: 'created',
        currentData: subscription,
        stripeEventId: subscription.id,
      },
    });
  }

  private async handleSubscriptionUpdated(subscription: any) {
    // Log subscription update event
    await prisma.subscriptionEvent.create({
      data: {
        subscriptionId: subscription.id,
        type: 'updated',
        currentData: subscription,
        stripeEventId: subscription.id,
      },
    });
  }

  private async handleSubscriptionDeleted(subscription: any) {
    // Log subscription deletion event
    await prisma.subscriptionEvent.create({
      data: {
        subscriptionId: subscription.id,
        type: 'deleted',
        currentData: subscription,
        stripeEventId: subscription.id,
      },
    });
  }

  private async handlePaymentSucceeded(invoice: any) {
    // Log payment success event
    await prisma.subscriptionEvent.create({
      data: {
        subscriptionId: invoice.subscription,
        type: 'payment_succeeded',
        currentData: invoice,
        stripeEventId: invoice.id,
      },
    });
  }

  private async handlePaymentFailed(invoice: any) {
    // Log payment failure event
    await prisma.subscriptionEvent.create({
      data: {
        subscriptionId: invoice.subscription,
        type: 'payment_failed',
        currentData: invoice,
        stripeEventId: invoice.id,
      },
    });
  }
}

export default SubscriptionService.getInstance(); 