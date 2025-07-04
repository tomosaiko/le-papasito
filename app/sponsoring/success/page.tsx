"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SponsoringSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sponsoringDetails, setSponsoringDetails] = useState<any>(null)

  useEffect(() => {
    // Ici, vous pourriez vérifier le statut de la session avec Stripe
    // et récupérer les détails du sponsoring
    // Pour l'instant, nous simulons simplement un chargement
    const timer = setTimeout(() => {
      setLoading(false)
      setSponsoringDetails({
        id: sessionId,
        status: "paid",
        plan: "premium",
        startDate: new Date().toLocaleDateString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      })
    }, 1500)

    return () => clearTimeout(timer)
  }, [sessionId])

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-lg">Vérification de votre paiement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-500">Une erreur est survenue</CardTitle>
            <CardDescription>Nous n'avons pas pu vérifier votre paiement</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/sponsoring">Retour à la page de sponsoring</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle>Paiement réussi !</CardTitle>
          <CardDescription>Votre annonce sponsorisée a été créée avec succès</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-secondary/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Détails de votre sponsoring</h3>
              <p className="text-sm mb-1">
                <strong>Plan :</strong>{" "}
                {sponsoringDetails?.plan.charAt(0).toUpperCase() + sponsoringDetails?.plan.slice(1)}
              </p>
              <p className="text-sm mb-1">
                <strong>Date de début :</strong> {sponsoringDetails?.startDate}
              </p>
              <p className="text-sm">
                <strong>Date de fin :</strong> {sponsoringDetails?.endDate}
              </p>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Votre annonce sera examinée par notre équipe et mise en ligne dans les plus brefs délais.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/dashboard">Accéder à mon tableau de bord</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
