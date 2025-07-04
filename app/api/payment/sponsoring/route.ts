import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

// Vérifier que la clé API est disponible
const stripeSecretKey = process.env.STRIPE_SECRET_KEY
if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY is not defined")
}

const stripe = new Stripe(stripeSecretKey || "", {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    // Vérifier que Stripe est correctement initialisé
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Stripe API key is not configured. Please contact the administrator." },
        { status: 500 },
      )
    }

    const { planType, metadata } = await request.json()

    // Define prices based on plan type
    const prices = {
      basic: 9900, // 99€ in cents
      premium: 19900, // 199€ in cents
      elite: 39900, // 399€ in cents
    }

    // Get the price based on the selected plan
    const price = prices[planType as keyof typeof prices] || prices.premium

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Sponsoring ${planType.charAt(0).toUpperCase() + planType.slice(1)}`,
              description: getPlanDescription(planType),
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/sponsoring/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/sponsoring`,
      metadata: {
        type: "sponsoring",
        plan: planType,
        ...metadata,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "An error occurred while creating the checkout session" }, { status: 500 })
  }
}

function getPlanDescription(planType: string): string {
  switch (planType) {
    case "basic":
      return "Annonce sponsorisée pour 3 jours"
    case "premium":
      return "Annonce sponsorisée pour 7 jours avec visibilité améliorée"
    case "elite":
      return "Annonce sponsorisée pour 15 jours avec visibilité maximale et services premium"
    default:
      return "Annonce sponsorisée"
  }
}
