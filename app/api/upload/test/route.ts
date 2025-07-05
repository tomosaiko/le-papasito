import { NextRequest, NextResponse } from 'next/server'
import { ImageService } from '@/lib/services/image.service'

// Simulation d'upload pour test
export async function POST(request: NextRequest) {
  try {
    // Simuler un upload réussi
    const mockUploadResult = {
      url: 'https://via.placeholder.com/800x600/0066CC/FFFFFF?text=Test+Image',
      secure_url: 'https://via.placeholder.com/800x600/0066CC/FFFFFF?text=Test+Image',
      public_id: 'test-image-' + Date.now(),
      width: 800,
      height: 600,
      format: 'png',
      bytes: 50000,
      created_at: new Date().toISOString()
    }

    // Simuler la sauvegarde en base
    const testUserId = 'test-user-123'
    
    try {
      const imageRecord = await ImageService.saveImage({
        userId: testUserId,
        type: 'gallery',
        url: mockUploadResult.secure_url,
        publicId: mockUploadResult.public_id,
        width: mockUploadResult.width,
        height: mockUploadResult.height,
        format: mockUploadResult.format,
        bytes: mockUploadResult.bytes,
        position: 0,
        isMain: true
      })

      return NextResponse.json({
        success: true,
        message: 'Test d\'upload réussi',
        data: {
          uploadResult: mockUploadResult,
          imageRecord: imageRecord
        }
      })
    } catch (dbError) {
      console.error('Erreur base de données:', dbError)
      return NextResponse.json({
        success: false,
        error: 'Erreur lors de la sauvegarde en base',
        details: dbError
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Erreur test upload:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors du test d\'upload',
      details: error
    }, { status: 500 })
  }
}

// Test des statistiques d'images
export async function GET(request: NextRequest) {
  try {
    const stats = await ImageService.getImageStats()
    
    return NextResponse.json({
      success: true,
      message: 'Statistiques d\'images',
      data: stats
    })
  } catch (error) {
    console.error('Erreur stats images:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques',
      details: error
    }, { status: 500 })
  }
} 