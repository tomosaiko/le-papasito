import { NextRequest, NextResponse } from 'next/server';
import SubscriptionService from '@/lib/services/subscription.service';

export async function GET(request: NextRequest) {
  try {
    // Get available subscription plans
    const plans = SubscriptionService.getPlans();

    // Convert to array format
    const plansArray = Object.entries(plans).map(([type, plan]) => ({
      type,
      ...plan,
    }));

    return NextResponse.json(plansArray);
  } catch (error) {
    console.error('[API] Subscription plans error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 