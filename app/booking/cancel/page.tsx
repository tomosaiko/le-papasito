"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BookingCancelPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">Paiement annulé</CardTitle>
          <CardDescription>Votre paiement a été annulé et aucun montant n'a été débité.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary/50 p-4 rounded-lg">
            <p className="text-sm">
              Si vous avez rencontré des difficultés lors du paiement ou si vous avez des questions, n'hésitez pas à
              contacter notre service client.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/" className="w-full">
            <Button className="w-full">Retour à l'accueil</Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la réservation
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
