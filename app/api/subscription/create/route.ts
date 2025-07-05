import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SubscriptionService from '@/lib/services/subscription.service';
import { z } from 'zod';

const CreateSubscriptionSchema = z.object({
  planType: z.enum(['PREMIUM', 'VIP']),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
  paymentMethodId: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = CreateSubscriptionSchema.parse(body);

    // Create subscription
    const subscription = await SubscriptionService.createSubscription(
      session.user.id,
      validatedData.planType,
      validatedData.billingCycle,
      validatedData.paymentMethodId,
      validatedData.metadata
    );

    return NextResponse.json(subscription);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('[API] Create subscription error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 