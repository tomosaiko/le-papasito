import { loadStripe } from "@stripe/stripe-js"

// Assurez-vous que cette clé est dans vos variables d'environnement
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || ""

let stripePromise: Promise<any> | null = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublicKey)
  }
  return stripePromise
}
