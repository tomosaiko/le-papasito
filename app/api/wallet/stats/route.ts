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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') as 'week' | 'month' | 'year' || 'month';

    // Get wallet statistics
    const stats = await WalletService.getWalletStats(session.user.id, period);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[API] Wallet stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 