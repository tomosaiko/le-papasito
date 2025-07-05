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
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // Valider le fichier
    try {
      UploadService.validateImageFile(file)
    } catch (error) {
      return NextResponse.json(
        { error: `Fichier invalide: ${error}` },
        { status: 400 }
      )
    }

    // Upload vers Cloudinary
    const uploadResult = await UploadService.uploadAvatar(file, session.user.id)

    // Sauvegarder en base de données
    const imageRecord = await ImageService.saveImage({
      userId: session.user.id,
      type: 'avatar',
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
      isMain: true
    })

    return NextResponse.json({
      success: true,
      message: 'Avatar uploadé avec succès',
      data: {
        id: imageRecord.id,
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        optimizedUrls: UploadService.getOptimizedUrls(uploadResult.public_id)
      }
    })

  } catch (error) {
    console.error('[API] Erreur upload avatar:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload de l\'avatar' },
      { status: 500 }
    )
  }
} 