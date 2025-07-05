import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createHmac } from "crypto"
import { headers } from "next/headers"
import { sendBookingNotification } from "@/lib/notifications/brevo-client"

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy_key")

// Webhook pour Stripe
export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature") || ""

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET || "")
  } catch (error: any) {
    console.error("Webhook signature verification failed:", error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Gérer les événements de paiement
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // Récupérer les métadonnées
    const metadata = session.metadata || {}
    const bookingId = metadata.bookingId

    if (bookingId) {
      // Mettre à jour le statut de la réservation dans la base de données
      // await updateBookingStatus(bookingId, 'paid');

      // Envoyer une notification de confirmation
      if (session.customer_details?.email) {
        await sendBookingNotification(
          session.customer_details.email,
          session.customer_details.name || "Client",
          session.customer_details.phone || "",
          {
            date: metadata.bookingDate,
            timeSlot: { startTime: metadata.startTime },
            duration: metadata.duration || "1",
          },
        )
      }
    }
  }

  return NextResponse.json({ received: true })
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
