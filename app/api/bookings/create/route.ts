import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { BookingService } from "@/lib/services/booking.service"
import { UserService } from "@/lib/services/user.service"
import { sendBookingNotification } from "@/lib/notifications/brevo-client"

export async function POST(request: NextRequest) {
  try {
    const bookingData = await request.json()
    
    // Validation des données
    if (!bookingData.escortId || !bookingData.clientId || !bookingData.date || 
        !bookingData.startTime || !bookingData.endTime || !bookingData.totalAmount) {
      return NextResponse.json(
        { error: "Données manquantes. Requis: escortId, clientId, date, startTime, endTime, totalAmount" },
        { status: 400 }
      )
    }

    // Convertir les dates
    const date = new Date(bookingData.date)
    const startTime = new Date(bookingData.startTime)
    const endTime = new Date(bookingData.endTime)

    // Calculer la durée en heures
    const duration = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60))

    // Vérifier que les utilisateurs existent
    const [client, escort] = await Promise.all([
      UserService.findById(bookingData.clientId),
      UserService.findById(bookingData.escortId)
    ])

    if (!client) {
      return NextResponse.json(
        { error: "Client non trouvé" },
        { status: 404 }
      )
    }

    if (!escort) {
      return NextResponse.json(
        { error: "Escort non trouvé" },
        { status: 404 }
      )
    }

    if (escort.role !== 'ESCORT') {
      return NextResponse.json(
        { error: "L'utilisateur spécifié n'est pas un escort" },
        { status: 400 }
      )
    }

    // Créer la réservation
    const booking = await BookingService.createBooking({
      clientId: bookingData.clientId,
      escortId: bookingData.escortId,
      date,
      startTime,
      endTime,
      duration,
      totalAmount: bookingData.totalAmount,
      notes: bookingData.notes
    })

    // Envoyer notification email au client
    try {
      await sendBookingNotification(
        client.email,
        client.name,
        '', // phone - optionnel
        {
          date: date.toDateString(),
          timeSlot: { startTime: startTime.toTimeString() },
          duration: duration.toString()
        }
      )
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError)
      // Ne pas faire échouer la réservation pour un problème d'email
    }

    // Revalider les pages concernées
    revalidatePath('/hotesses')
    revalidatePath('/disponibilite/results')
    revalidatePath('/dashboard')
    revalidatePath('/escort-dashboard')

    return NextResponse.json({ 
      success: true, 
      booking 
    })

  } catch (error) {
    console.error('Erreur création booking:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('clientId')
    const escortId = searchParams.get('escortId')
    const status = searchParams.get('status') as any
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let bookings

    if (clientId) {
      // Récupérer les réservations du client
      bookings = await BookingService.getUserBookings(clientId, 'client', {
        status,
        page,
        limit
      })
    } else if (escortId) {
      // Récupérer les réservations de l'escort
      bookings = await BookingService.getUserBookings(escortId, 'escort', {
        status,
        page,
        limit
      })
    } else {
      // Recherche générale avec filtres
      bookings = await BookingService.searchBookings({
        status,
        page,
        limit
      })
    }

    return NextResponse.json({
      success: true,
      ...bookings
    })

  } catch (error) {
    console.error('Erreur récupération bookings:', error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

// API pour mettre à jour le statut d'une réservation
export async function PATCH(request: NextRequest) {
  try {
    const { bookingId, status, userId } = await request.json()

    if (!bookingId || !status || !userId) {
      return NextResponse.json(
        { error: "Données manquantes: bookingId, status, userId requis" },
        { status: 400 }
      )
    }

    let updatedBooking

    switch (status) {
      case 'CONFIRMED':
        updatedBooking = await BookingService.confirmBooking(bookingId, userId)
        break
      case 'CANCELLED':
        updatedBooking = await BookingService.cancelBooking(bookingId, userId)
        break
      case 'COMPLETED':
        updatedBooking = await BookingService.completeBooking(bookingId)
        break
      default:
        updatedBooking = await BookingService.updateBookingStatus(bookingId, status, userId)
    }

    // Revalider les pages
    revalidatePath('/dashboard')
    revalidatePath('/escort-dashboard')

    return NextResponse.json({
      success: true,
      booking: updatedBooking
    })

  } catch (error) {
    console.error('Erreur mise à jour booking:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
} 