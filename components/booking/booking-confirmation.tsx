import { CheckCircle, Calendar, Clock, User, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface BookingConfirmationProps {
  booking: {
    id: string
    name: string
    email: string
    phone: string
    date: Date
    timeSlot: {
      startTime: string
      endTime: string
    }
    duration: string
    message?: string
  }
}

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const formattedDate = booking.date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const getDurationText = (duration: string) => {
    if (duration === "overnight") return "Nuit complète"
    return `${duration} heure${Number.parseInt(duration) > 1 ? "s" : ""}`
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="bg-green-100 rounded-full p-6 inline-flex mb-4">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Réservation confirmée !</h2>
        <p className="text-muted-foreground">Votre réservation a été enregistrée avec succès.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la réservation</CardTitle>
          <CardDescription>Référence: #{booking.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <p className="font-medium">Horaire</p>
              <p className="text-muted-foreground">
                {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
              </p>
              <p className="text-muted-foreground">Durée: {getDurationText(booking.duration)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <p className="font-medium">Client</p>
              <p className="text-muted-foreground">{booking.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <p className="font-medium">Contact</p>
              <p className="text-muted-foreground">{booking.phone}</p>
              <p className="text-muted-foreground">{booking.email}</p>
            </div>
          </div>
          {booking.message && (
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">Message</p>
                <p className="text-muted-foreground">{booking.message}</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Un email de confirmation a été envoyé à {booking.email}. Vous recevrez également un rappel 24 heures avant
            votre rendez-vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">Retour au tableau de bord</Button>
            </Link>
            <Link href="/messages" className="flex-1">
              <Button variant="outline" className="w-full">
                Contacter l'escorte
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
