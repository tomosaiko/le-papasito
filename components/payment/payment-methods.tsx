"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, AlertCircle } from "lucide-react"
import { getStripe } from "@/lib/payment/stripe-client"
import { formatPrice } from "@/lib/payment/commission"
import { useRouter } from "next/navigation"

interface PaymentMethodsProps {
  amount: number
  bookingId: string
  bookingDetails: any
}

export function PaymentMethods({ amount, bookingId, bookingDetails }: PaymentMethodsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleStripePayment = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Créer une session de paiement Stripe
      const response = await fetch("/api/payment/stripe/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          currency: "eur",
          metadata: {
            bookingId,
            bookingDate: bookingDetails.date,
            startTime: bookingDetails.timeSlot.startTime,
            duration: bookingDetails.duration,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create payment session")
      }

      const { sessionId, url } = await response.json()

      // Rediriger vers la page de paiement Stripe
      if (url) {
        window.location.href = url
      } else {
        // Fallback si l'URL n'est pas fournie
        const stripe = await getStripe()
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      setError(error.message || "Une erreur est survenue lors du paiement")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Paiement</CardTitle>
        <CardDescription>Confirmez votre réservation avec votre carte bancaire</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="card" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Carte bancaire
            </TabsTrigger>
          </TabsList>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                En mode développement, les paiements sont en mode test. Aucune transaction réelle ne sera effectuée.
              </p>
            </div>
          )}

          <TabsContent value="card" className="mt-4">
            <div className="space-y-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Détails du paiement</h3>
                <p className="text-sm mb-1">
                  <strong>Montant:</strong> {formatPrice(amount)}
                </p>
                <p className="text-sm mb-1">
                  <strong>Méthodes acceptées:</strong> Visa, Mastercard, American Express, Apple Pay, Google Pay
                </p>
                <p className="text-sm">
                  <strong>Sécurité:</strong> Paiement sécurisé via Stripe
                </p>
              </div>

              <Button
                onClick={handleStripePayment}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? "Traitement en cours..." : "Payer par carte bancaire"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">Le paiement est sécurisé et chiffré</p>
      </CardFooter>
    </Card>
  )
}
