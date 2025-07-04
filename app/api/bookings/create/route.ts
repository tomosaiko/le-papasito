import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// Simuler une base de données en mémoire
let bookingsData: any[] = []

export async function POST(request: NextRequest) {
  try {
    const booking = await request.json()
    
    // Validation des données
    if (!booking.providerId || !booking.date || !booking.timeSlot || !booking.clientName) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      )
    }

    // Vérifier si le créneau est toujours disponible
    const isAvailable = await checkAvailability(booking.providerId, booking.date, booking.timeSlot)
    
    if (!isAvailable) {
      return NextResponse.json(
        { error: "Créneau non disponible" },
        { status: 409 }
      )
    }

    // Créer le booking
    const newBooking = {
      id: Date.now().toString(),
      ...booking,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    bookingsData.push(newBooking)

    // Marquer le créneau comme réservé
    await markTimeSlotAsBooked(booking.providerId, booking.date, booking.timeSlot)

    // Revalider les pages
    revalidatePath('/hotesses')
    revalidatePath('/disponibilite/results')

    // Ici on enverrait une notification au provider
    // await notifyProvider(newBooking)

    return NextResponse.json({ 
      success: true, 
      booking: newBooking 
    })

  } catch (error) {
    console.error('Erreur création booking:', error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const providerId = searchParams.get('providerId')
  const status = searchParams.get('status')

  let filteredBookings = bookingsData

  if (providerId) {
    filteredBookings = filteredBookings.filter(b => b.providerId === providerId)
  }

  if (status) {
    filteredBookings = filteredBookings.filter(b => b.status === status)
  }

  return NextResponse.json({ bookings: filteredBookings })
}

// Fonctions utilitaires
async function checkAvailability(providerId: string, date: string, timeSlot: string): Promise<boolean> {
  // Ici on vérifierait dans la vraie base de données
  // Pour l'instant, on simule que c'est toujours disponible
  return true
}

async function markTimeSlotAsBooked(providerId: string, date: string, timeSlot: string) {
  // Ici on marquerait le créneau comme réservé dans la base de données
  console.log(`Créneau marqué comme réservé: ${providerId} - ${date} - ${timeSlot}`)
} 