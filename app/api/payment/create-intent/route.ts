import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import StripeService from '@/lib/services/stripe.service';
import { z } from 'zod';

const CreatePaymentIntentSchema = z.object({
  bookingId: z.string(),
  amount: z.number().min(1),
  currency: z.string().default('eur'),
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
    const validatedData = CreatePaymentIntentSchema.parse(body);

    // Create payment intent via Stripe service
    const paymentIntent = await StripeService.createPaymentIntent({
      ...validatedData,
      customerId: session.user.id,
    });

    return NextResponse.json(paymentIntent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('[API] Create payment intent error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 