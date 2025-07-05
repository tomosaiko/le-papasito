"use client"

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Crop, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Eye, 
  Download,
  Trash2,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react'
import Image from 'next/image'

interface UploadedImage {
  id: string
  file: File
  preview: string
  status: 'uploading' | 'success' | 'error'
  progress: number
  optimized?: {
    thumbnail: string
    medium: string
    large: string
  }
}

interface AdvancedImageUploadProps {
  maxFiles?: number
  maxSize?: number // en MB
  acceptedTypes?: string[]
  onUpload?: (images: UploadedImage[]) => void
  onRemove?: (imageId: string) => void
  className?: string
  showPreview?: boolean
  enableCrop?: boolean
  enableOptimization?: boolean
}

export default function AdvancedImageUpload({
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  onUpload,
  onRemove,
  className = "",
  showPreview = true,
  enableCrop = false,
  enableOptimization = true
}: AdvancedImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Configuration dropzone
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setDragActive(false)

    // Gérer les fichiers rejetés
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach((error: any) => {
          if (error.code === 'file-too-large') {
            toast({
              title: "Fichier trop volumineux",
              description: `${file.name} dépasse la limite de ${maxSize}MB`,
              variant: "destructive",
            })
          } else if (error.code === 'file-invalid-type') {
            toast({
              title: "Type de fichier non supporté",
              description: `${file.name} n'est pas un format d'image valide`,
              variant: "destructive",
            })
          }
        })
      })
    }

    // Vérifier le nombre max de fichiers
    if (images.length + acceptedFiles.length > maxFiles) {
      toast({
        title: "Trop de fichiers",
        description: `Vous ne pouvez uploader que ${maxFiles} images maximum`,
        variant: "destructive",
      })
      return
    }

    // Traiter les fichiers acceptés
    const newImages: UploadedImage[] = acceptedFiles.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0
    }))

    setImages(prev => [...prev, ...newImages])
    uploadImages(newImages)
  }, [images.length, maxFiles, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: {
      'image/*': acceptedTypes.map(type => type.replace('image/', '.'))
    },
    maxSize: maxSize * 1024 * 1024,
    multiple: maxFiles > 1,
    disabled: isUploading
  })

  // Simuler l'upload avec progress
  const uploadImages = async (imagesToUpload: UploadedImage[]) => {
    setIsUploading(true)

    for (const image of imagesToUpload) {
      try {
        // Simuler progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          setImages(prev => prev.map(img => 
            img.id === image.id 
              ? { ...img, progress }
              : img
          ))
        }

        // Simuler l'optimisation
        if (enableOptimization) {
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const optimizedUrls = {
            thumbnail: `${image.preview}?w=150&h=150`,
            medium: `${image.preview}?w=400&h=400`,
            large: `${image.preview}?w=800&h=800`
          }

          setImages(prev => prev.map(img => 
            img.id === image.id 
              ? { 
                  ...img, 
                  status: 'success',
                  optimized: optimizedUrls
                }
              : img
          ))
        } else {
          setImages(prev => prev.map(img => 
            img.id === image.id 
              ? { ...img, status: 'success' }
              : img
          ))
        }

        toast({
          title: "Image uploadée",
          description: `${image.file.name} a été uploadé avec succès`,
        })

      } catch (error) {
        setImages(prev => prev.map(img => 
          img.id === image.id 
            ? { ...img, status: 'error' }
            : img
        ))

        toast({
          title: "Erreur d'upload",
          description: `Impossible d'uploader ${image.file.name}`,
          variant: "destructive",
        })
      }
    }

    setIsUploading(false)
    
    // Notifier le parent
    const successfulImages = images.filter(img => img.status === 'success')
    onUpload?.(successfulImages)
  }

  // Supprimer une image
  const removeImage = (imageId: string) => {
    const imageToRemove = images.find(img => img.id === imageId)
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview)
      setImages(prev => prev.filter(img => img.id !== imageId))
      onRemove?.(imageId)
      
      toast({
        title: "Image supprimée",
        description: "L'image a été supprimée de votre galerie",
      })
    }
  }

  // Prévisualiser une image
  const previewImage = (imageId: string) => {
    setSelectedImage(imageId)
  }

  // Stats
  const successCount = images.filter(img => img.status === 'success').length
  const uploadingCount = images.filter(img => img.status === 'uploading').length
  const errorCount = images.filter(img => img.status === 'error').length

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Zone de drop */}
      <Card className="border-2 border-dashed transition-all duration-300 hover:border-gold-DEFAULT/50">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`text-center cursor-pointer transition-all duration-300 ${
              dragActive ? 'scale-105 opacity-80' : ''
            } ${isDragActive ? 'animate-pulse' : ''}`}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gold-DEFAULT/10 rounded-full flex items-center justify-center">
                <Upload className={`w-8 h-8 text-gold-DEFAULT ${isDragActive ? 'animate-bounce' : ''}`} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {isDragActive ? 'Déposez vos images ici' : 'Uploadez vos images'}
                </h3>
                <p className="text-gray-400 mb-4">
                  Glissez-déposez vos fichiers ou cliquez pour sélectionner
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                  <Badge variant="outline">Max {maxFiles} images</Badge>
                  <Badge variant="outline">Max {maxSize}MB par image</Badge>
                  <Badge variant="outline">JPG, PNG, WebP</Badge>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                disabled={isUploading}
                className="border-gold-DEFAULT text-gold-DEFAULT hover:bg-gold-DEFAULT hover:text-black"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Sélectionner des images
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{images.length}</div>
              <div className="text-sm text-gray-400">Total</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{successCount}</div>
              <div className="text-sm text-gray-400">Réussies</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{uploadingCount}</div>
              <div className="text-sm text-gray-400">En cours</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-400">{errorCount}</div>
              <div className="text-sm text-gray-400">Erreurs</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Prévisualisation des images */}
      {showPreview && images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Images uploadées ({images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group bg-gray-900 rounded-lg overflow-hidden aspect-square"
                >
                  {/* Image */}
                  <Image
                    src={image.preview}
                    alt="Upload preview"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Status overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => previewImage(image.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {enableCrop && image.status === 'success' && (
                        <Button
                          size="sm"
                          variant="secondary"
                        >
                          <Crop className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(image.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="absolute top-2 left-2">
                    {image.status === 'uploading' && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400">
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        {image.progress}%
                      </Badge>
                    )}
                    {image.status === 'success' && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        <Check className="w-3 h-3 mr-1" />
                        OK
                      </Badge>
                    )}
                    {image.status === 'error' && (
                      <Badge variant="secondary" className="bg-red-500/20 text-red-400">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Erreur
                      </Badge>
                    )}
                  </div>
                  
                  {/* Progress bar */}
                  {image.status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <Progress value={image.progress} className="h-1" />
                    </div>
                  )}
                  
                  {/* File info */}
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xs text-white truncate bg-black/50 px-2 py-1 rounded">
                      {image.file.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Messages d'aide */}
      {images.length === 0 && (
        <Alert>
          <ImageIcon className="h-4 w-4" />
          <AlertDescription>
            Commencez par uploader vos premières images. Nous optimiserons automatiquement 
            leur qualité et taille pour une meilleure performance.
          </AlertDescription>
        </Alert>
      )}

      {errorCount > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errorCount} image(s) n'ont pas pu être uploadée(s). Vérifiez le format et la taille de vos fichiers.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
} 