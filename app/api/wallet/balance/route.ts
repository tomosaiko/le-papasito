import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import WalletService from '@/lib/services/wallet.service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get wallet balance summary
    const balanceSummary = await WalletService.getBalanceSummary(session.user.id);

    return NextResponse.json(balanceSummary);
  } catch (error) {
    console.error('[API] Wallet balance error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 