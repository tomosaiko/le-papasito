"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from '@/hooks/use-toast'
import { Plus, Star, Trash2, Move, Eye, Download } from 'lucide-react'
import ImageUpload from './image-upload'
import Image from 'next/image'

interface GalleryImage {
  id: string
  url: string
  publicId: string
  width: number
  height: number
  position: number
  isMain: boolean
  createdAt: string
  thumbnail: string
  medium: string
  large: string
  original: string
}

interface GalleryUploadProps {
  userId?: string
  onImageChange?: (images: GalleryImage[]) => void
  className?: string
}

export default function GalleryUpload({
  userId,
  onImageChange,
  className
}: GalleryUploadProps) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [draggedImage, setDraggedImage] = useState<string | null>(null)

  // Charger les images existantes
  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/upload/gallery')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement de la galerie')
      }

      const result = await response.json()
      
      if (result.success) {
        setImages(result.data)
        onImageChange?.(result.data)
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: `Impossible de charger la galerie: ${error}`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return

    setLoading(true)
    
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload/gallery', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'upload')
      }

      const result = await response.json()
      
      if (result.success) {
        await loadGallery() // Recharger la galerie
        setShowUpload(false)
        
        toast({
          title: 'Images uploadées',
          description: `${result.data.length} image(s) ajoutée(s) à votre galerie`
        })
      } else {
        throw new Error(result.error || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: `Impossible d'uploader les images: ${error}`,
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      const response = await fetch('/api/upload/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la suppression')
      }

      const result = await response.json()
      
      if (result.success) {
        await loadGallery() // Recharger la galerie
        
        toast({
          title: 'Image supprimée',
          description: 'L\'image a été supprimée avec succès'
        })
      } else {
        throw new Error(result.error || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: `Impossible de supprimer l'image: ${error}`,
        variant: 'destructive'
      })
    }
  }

  const handleSetMainImage = async (imageId: string) => {
    try {
      const response = await fetch('/api/upload/gallery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'setMain', imageId })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la mise à jour')
      }

      const result = await response.json()
      
      if (result.success) {
        await loadGallery() // Recharger la galerie
        
        toast({
          title: 'Image principale définie',
          description: 'Cette image est maintenant votre image principale'
        })
      } else {
        throw new Error(result.error || 'Erreur lors de la mise à jour')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: `Impossible de définir l'image principale: ${error}`,
        variant: 'destructive'
      })
    }
  }

  const handleReorderImages = async (newOrder: string[]) => {
    try {
      const response = await fetch('/api/upload/gallery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'reorder', imageIds: newOrder })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de la réorganisation')
      }

      const result = await response.json()
      
      if (result.success) {
        await loadGallery() // Recharger la galerie
        
        toast({
          title: 'Images réorganisées',
          description: 'L\'ordre des images a été mis à jour'
        })
      } else {
        throw new Error(result.error || 'Erreur lors de la réorganisation')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: `Impossible de réorganiser les images: ${error}`,
        variant: 'destructive'
      })
    }
  }

  const handleDragStart = (e: React.DragEvent, imageId: string) => {
    setDraggedImage(imageId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetImageId: string) => {
    e.preventDefault()
    
    if (!draggedImage || draggedImage === targetImageId) return

    const draggedIndex = images.findIndex(img => img.id === draggedImage)
    const targetIndex = images.findIndex(img => img.id === targetImageId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newImages = [...images]
    const draggedImageData = newImages[draggedIndex]
    
    newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedImageData)

    const newOrder = newImages.map(img => img.id)
    handleReorderImages(newOrder)
    
    setDraggedImage(null)
  }

  if (loading && images.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Chargement de la galerie...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Galerie d'images</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">
              {images.length} image{images.length > 1 ? 's' : ''}
            </Badge>
            <Dialog open={showUpload} onOpenChange={setShowUpload}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter des images</DialogTitle>
                </DialogHeader>
                <ImageUpload
                  onUpload={handleUpload}
                  maxFiles={10}
                  maxSize={10}
                  multiple={true}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Aucune image dans votre galerie</p>
            <Button onClick={() => setShowUpload(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter des images
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-move"
                draggable
                onDragStart={(e) => handleDragStart(e, image.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, image.id)}
              >
                <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image.thumbnail}
                    alt={`Image ${image.position + 1}`}
                    fill
                    className="object-cover"
                  />
                  
                  {image.isMain && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-500">
                        <Star className="w-3 h-3 mr-1" />
                        Principal
                      </Badge>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedImage(image)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {!image.isMain && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSetMainImage(image.id)}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Modal de visualisation d'image */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Image {selectedImage && selectedImage.position + 1}
              {selectedImage?.isMain && (
                <Badge className="ml-2 bg-yellow-500">
                  <Star className="w-3 h-3 mr-1" />
                  Principal
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={selectedImage.large}
                  alt={`Image ${selectedImage.position + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  {selectedImage.width} × {selectedImage.height}
                </span>
                <span>
                  Ajoutée le {new Date(selectedImage.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedImage.original, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                
                {!selectedImage.isMain && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleSetMainImage(selectedImage.id)
                      setSelectedImage(null)
                    }}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Définir comme principal
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
} 