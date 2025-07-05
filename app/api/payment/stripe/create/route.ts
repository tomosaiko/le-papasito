import { NextResponse } from "next/server"
import Stripe from "stripe"
import { calculateCommission } from "@/lib/payment/commission"

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key")

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount, currency = "eur", metadata = {}, successUrl, cancelUrl } = body

    // Calculer la commission
    const { originalAmount, commission } = calculateCommission(amount)

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: "Réservation Le Papasito",
              description: "Réservation de service",
              metadata: {
                ...metadata,
                commission_amount: commission.toString(),
              },
            },
            unit_amount: Math.round(originalAmount * 100), // Stripe utilise les centimes
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/booking/cancel`,
      metadata: {
        ...metadata,
        commission_amount: commission.toString(),
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Error creating Stripe session:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
