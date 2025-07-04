import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// Simuler une base de données en mémoire (à remplacer par une vraie DB)
let availabilityData: any[] = []

export async function GET() {
  return NextResponse.json({ availabilities: availabilityData })
}

export async function PUT(request: NextRequest) {
  try {
    const availability = await request.json()
    
    // Validation des données
    if (!availability.providerId || !availability.date || !availability.timeSlots) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      )
    }

    // Mettre à jour ou créer la disponibilité
    const existingIndex = availabilityData.findIndex(
      a => a.providerId === availability.providerId && a.date === availability.date
    )

    if (existingIndex >= 0) {
      availabilityData[existingIndex] = {
        ...availabilityData[existingIndex],
        ...availability,
        updatedAt: new Date().toISOString()
      }
    } else {
      availabilityData.push({
        ...availability,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    }

    // Revalider les pages qui affichent les disponibilités
    revalidatePath('/hotesses')
    revalidatePath('/disponibilite/results')

    // Ici on enverrait une notification WebSocket en temps réel
    // await notifyAvailabilityUpdate(availability)

    return NextResponse.json({ 
      success: true, 
      availability: availabilityData.find(
        a => a.providerId === availability.providerId && a.date === availability.date
      )
    })

  } catch (error) {
    console.error('Erreur mise à jour disponibilité:', error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { providerId, date } = await request.json()
    
    availabilityData = availabilityData.filter(
      a => !(a.providerId === providerId && a.date === date)
    )

    revalidatePath('/hotesses')
    revalidatePath('/disponibilite/results')

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur suppression disponibilité:', error)
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
} 