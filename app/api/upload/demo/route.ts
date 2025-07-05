import { NextRequest, NextResponse } from 'next/server'

// Demo sans authentification pour test
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    // Simuler différents types de réponses
    if (action === 'upload') {
      return NextResponse.json({
        success: true,
        message: 'Upload simulé avec succès',
        data: {
          id: 'demo-' + Date.now(),
          url: 'https://via.placeholder.com/800x600/0066CC/FFFFFF?text=Demo+Upload',
          publicId: 'demo-image-' + Date.now(),
          width: 800,
          height: 600,
          format: 'png',
          optimizedUrls: {
            thumbnail: 'https://via.placeholder.com/150x150/0066CC/FFFFFF?text=Thumb',
            medium: 'https://via.placeholder.com/400x300/0066CC/FFFFFF?text=Medium',
            large: 'https://via.placeholder.com/800x600/0066CC/FFFFFF?text=Large',
            original: 'https://via.placeholder.com/800x600/0066CC/FFFFFF?text=Original'
          }
        }
      })
    }
    
    if (action === 'gallery') {
      return NextResponse.json({
        success: true,
        data: [
          {
            id: 'demo-1',
            url: 'https://via.placeholder.com/800x600/FF6B35/FFFFFF?text=Image+1',
            publicId: 'demo-1',
            width: 800,
            height: 600,
            position: 0,
            isMain: true,
            createdAt: new Date().toISOString(),
            thumbnail: 'https://via.placeholder.com/150x150/FF6B35/FFFFFF?text=1',
            medium: 'https://via.placeholder.com/400x300/FF6B35/FFFFFF?text=1',
            large: 'https://via.placeholder.com/800x600/FF6B35/FFFFFF?text=1',
            original: 'https://via.placeholder.com/800x600/FF6B35/FFFFFF?text=1'
          },
          {
            id: 'demo-2',
            url: 'https://via.placeholder.com/800x600/F7931E/FFFFFF?text=Image+2',
            publicId: 'demo-2',
            width: 800,
            height: 600,
            position: 1,
            isMain: false,
            createdAt: new Date().toISOString(),
            thumbnail: 'https://via.placeholder.com/150x150/F7931E/FFFFFF?text=2',
            medium: 'https://via.placeholder.com/400x300/F7931E/FFFFFF?text=2',
            large: 'https://via.placeholder.com/800x600/F7931E/FFFFFF?text=2',
            original: 'https://via.placeholder.com/800x600/F7931E/FFFFFF?text=2'
          }
        ]
      })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Demo API fonctionnelle',
      availableActions: ['upload', 'gallery']
    })
    
  } catch (error) {
    console.error('Erreur demo:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur demo',
      details: error
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API Demo Upload - Cloudinary System Test',
    endpoints: {
      POST: 'Simulation d\'upload avec action=upload ou action=gallery',
      GET: 'Informations sur l\'API'
    },
    systemStatus: 'Opérationnel',
    features: [
      'Upload d\'avatars avec compression',
      'Galeries d\'images avec drag & drop', 
      'URLs optimisées automatiques',
      'Validation sécurisée',
      'Suppression et réorganisation'
    ]
  })
} 