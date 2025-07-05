import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ImageService } from '@/lib/services/image.service'

export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { imageId, imageIds } = body

    if (imageId) {
      // Supprimer une seule image
      await ImageService.deleteImage(imageId, session.user.id)
      
      return NextResponse.json({
        success: true,
        message: 'Image supprimée avec succès'
      })
    }

    if (imageIds && Array.isArray(imageIds)) {
      // Supprimer plusieurs images
      const results = await Promise.allSettled(
        imageIds.map(id => ImageService.deleteImage(id, session.user.id))
      )
      
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length
      
      return NextResponse.json({
        success: true,
        message: `${successful} image(s) supprimée(s) avec succès`,
        details: {
          successful,
          failed,
          total: imageIds.length
        }
      })
    }

    return NextResponse.json(
      { error: 'Aucune image spécifiée pour la suppression' },
      { status: 400 }
    )

  } catch (error) {
    console.error('[API] Erreur suppression image:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'image' },
      { status: 500 }
    )
  }
} 