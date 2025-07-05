import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import StripeService from '@/lib/services/stripe.service';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('[Stripe Webhook] Event:', event.type);

    // Process the event through StripeService
    await StripeService.handleWebhook(event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Webhook pour Coinbase Commerce
export async function PUT(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("x-cc-webhook-signature") || ""

  // Vérifier la signature
  const hmac = createHmac("sha256", process.env.COINBASE_COMMERCE_WEBHOOK_SECRET || "")
  const expectedSignature = hmac.update(body).digest("hex")

  if (signature !== expectedSignature) {
    console.error("Coinbase Commerce webhook signature verification failed")
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const event = JSON.parse(body)

  // Gérer les événements de paiement
  if (event.type === "charge:confirmed") {
    const charge = event.data
    const metadata = charge.metadata || {}
    const bookingId = metadata.bookingId

    if (bookingId) {
      // Mettre à jour le statut de la réservation dans la base de données
      // await updateBookingStatus(bookingId, 'paid');
      // Envoyer une notification de confirmation
      // Vous devrez adapter ceci car Coinbase Commerce ne fournit pas directement les détails du client
      // Vous devrez les récupérer à partir de votre base de données en utilisant bookingId
    }
  }

  return NextResponse.json({ received: true })
}
