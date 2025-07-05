import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import WalletService from '@/lib/services/wallet.service';
import { z } from 'zod';

const WithdrawSchema = z.object({
  amount: z.number().min(50).max(10000),
  paymentMethod: z.enum(['bank_transfer', 'paypal', 'crypto']),
  bankDetails: z.object({
    accountName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
    swiftCode: z.string().optional(),
  }).optional(),
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
    
    // Validate request body
    const validatedData = WithdrawSchema.parse(body);

    // Process withdrawal
    const withdrawal = await WalletService.requestWithdrawal({
      userId: session.user.id,
      amount: validatedData.amount,
      paymentMethod: validatedData.paymentMethod,
      bankDetails: validatedData.bankDetails,
    });

    return NextResponse.json(withdrawal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('[API] Wallet withdraw error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 