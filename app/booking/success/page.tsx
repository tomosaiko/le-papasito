"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [bookingDetails, setBookingDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (sessionId) {
        try {
          // Dans une implémentation réelle, vous récupéreriez les détails de la réservation
          // à partir de votre base de données en utilisant le sessionId

          // Simuler une requête API
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Données de test
          setBookingDetails({
            id: `BK-${Math.floor(Math.random() * 10000)}`,
            escortName: "Sophia",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours à partir d'aujourd'hui
            timeSlot: { startTime: "18:00", endTime: "19:00" },
            duration: "1",
            amount: 250,
            paymentMethod: "card",
          })
        } catch (error) {
          console.error("Error fetching booking details:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }

    fetchBookingDetails()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Chargement des détails de votre réservation...</p>
        </div>
      </div>
    )
  }

  if (!bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Erreur</CardTitle>
            <CardDescription>Nous n'avons pas pu récupérer les détails de votre réservation.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Veuillez contacter notre service client pour obtenir de l'aide.</p>
          </CardContent>
          <CardFooter>
            <Link href="/">
              <Button>Retour à l'accueil</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Réservation confirmée!</CardTitle>
          <CardDescription>Votre paiement a été traité avec succès et votre réservation est confirmée.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-secondary/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Détails de la réservation</h3>
              <p className="text-sm mb-1">
                <strong>Numéro de réservation:</strong> {bookingDetails.id}
              </p>
              <p className="text-sm mb-1">
                <strong>Prestataire:</strong> {bookingDetails.escortName}
              </p>
              <div className="flex items-center text-sm mb-1">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <strong>Date:</strong>{" "}
                {bookingDetails.date.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
              <div className="flex items-center text-sm mb-1">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <strong>Horaire:</strong> {bookingDetails.timeSlot.startTime} - {bookingDetails.timeSlot.endTime}
              </div>
              <p className="text-sm mb-1">
                <strong>Durée:</strong> {bookingDetails.duration} heure(s)
              </p>
              <p className="text-sm">
                <strong>Montant payé:</strong>{" "}
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                }).format(bookingDetails.amount)}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Un email de confirmation a été envoyé à votre adresse email. Vous recevrez également un rappel 24 heures
                avant votre rendez-vous.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/" className="w-full">
            <Button className="w-full">
              Retour à l'accueil <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/booking/history" className="w-full">
            <Button variant="outline" className="w-full">
              Voir mes réservations
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
