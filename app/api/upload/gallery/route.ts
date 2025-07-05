import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { UploadService } from '@/lib/services/upload.service'
import { ImageService } from '@/lib/services/image.service'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Limiter le nombre de fichiers (max 10 par upload)
    if (files.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 fichiers autorisés par upload' },
        { status: 400 }
      )
    }

    // Valider tous les fichiers
    for (const file of files) {
      try {
        UploadService.validateImageFile(file)
      } catch (error) {
        return NextResponse.json(
          { error: `Fichier ${file.name} invalide: ${error}` },
          { status: 400 }
        )
      }
    }

    // Obtenir la position de départ
    const existingImages = await ImageService.getUserImages(session.user.id, 'gallery')
    let startPosition = existingImages.length

    // Upload multiple vers Cloudinary
    const uploadResults = await UploadService.uploadMultipleImages(files, session.user.id, 'gallery')

    // Sauvegarder en base de données
    const imageRecords = await Promise.all(
      uploadResults.map(async (uploadResult, index) => {
        const imageRecord = await ImageService.saveImage({
          userId: session.user.id,
          type: 'gallery',
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
          position: startPosition + index,
          isMain: index === 0 && existingImages.length === 0 // Première image principale si galerie vide
        })
        return imageRecord
      })
    )

    return NextResponse.json({
      success: true,
      message: `${uploadResults.length} image(s) uploadée(s) avec succès`,
      data: imageRecords.map((record, index) => ({
        id: record.id,
        url: uploadResults[index].secure_url,
        publicId: uploadResults[index].public_id,
        width: uploadResults[index].width,
        height: uploadResults[index].height,
        format: uploadResults[index].format,
        position: record.position,
        isMain: record.isMain,
        optimizedUrls: UploadService.getOptimizedUrls(uploadResults[index].public_id)
      }))
    })

  } catch (error) {
    console.error('[API] Erreur upload galerie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload des images' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer les images de galerie
    const gallery = await ImageService.getUserGallery(session.user.id)

    return NextResponse.json({
      success: true,
      data: gallery
    })

  } catch (error) {
    console.error('[API] Erreur récupération galerie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la galerie' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    const { imageIds, action, imageId } = body

    if (action === 'reorder' && imageIds) {
      // Réorganiser les images
      await ImageService.reorderGalleryImages(session.user.id, imageIds)
      
      return NextResponse.json({
        success: true,
        message: 'Images réorganisées avec succès'
      })
    }

    if (action === 'setMain' && imageId) {
      // Définir comme image principale
      await ImageService.setMainImage(imageId, session.user.id)
      
      return NextResponse.json({
        success: true,
        message: 'Image principale définie avec succès'
      })
    }

    return NextResponse.json(
      { error: 'Action non valide' },
      { status: 400 }
    )

  } catch (error) {
    console.error('[API] Erreur mise à jour galerie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la galerie' },
      { status: 500 }
    )
  }
} 