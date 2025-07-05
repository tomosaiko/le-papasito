"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { toast } from '@/hooks/use-toast'
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw, 
  Download, 
  Maximize, 
  Minimize,
  Move,
  Crop,
  Filter,
  Share2,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react'
import Image from 'next/image'

interface ImagePreviewModalProps {
  images: Array<{
    id: string
    preview: string
    file: File
    optimized?: {
      thumbnail: string
      medium: string
      large: string
    }
  }>
  currentImageId: string | null
  isOpen: boolean
  onClose: () => void
  onNavigate?: (imageId: string) => void
  onDownload?: (imageId: string) => void
  onDelete?: (imageId: string) => void
}

export default function ImagePreviewModal({
  images,
  currentImageId,
  isOpen,
  onClose,
  onNavigate,
  onDownload,
  onDelete
}: ImagePreviewModalProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [imageTransform, setImageTransform] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const currentImage = images.find(img => img.id === currentImageId)
  const currentIndex = images.findIndex(img => img.id === currentImageId)

  // Reset transform when image changes
  useEffect(() => {
    setZoom(100)
    setRotation(0)
    setImageTransform({ x: 0, y: 0 })
  }, [currentImageId])

  // Navigation
  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      onNavigate?.(images[currentIndex + 1].id)
    }
  }

  const goToPrevious = () => {
    if (currentIndex > 0) {
      onNavigate?.(images[currentIndex - 1].id)
    }
  }

  // Zoom functions
  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 500))
  }

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25))
  }

  const resetZoom = () => {
    setZoom(100)
    setImageTransform({ x: 0, y: 0 })
  }

  // Rotation functions
  const rotateClockwise = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const rotateCounterClockwise = () => {
    setRotation(prev => (prev - 90 + 360) % 360)
  }

  // Download function
  const downloadImage = () => {
    if (currentImage) {
      const link = document.createElement('a')
      link.href = currentImage.preview
      link.download = currentImage.file.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast({
        title: "Image téléchargée",
        description: `${currentImage.file.name} a été téléchargée`,
      })
    }
  }

  // Share function
  const shareImage = async () => {
    if (currentImage && navigator.share) {
      try {
        await navigator.share({
          title: currentImage.file.name,
          files: [currentImage.file]
        })
      } catch (error) {
        // Fallback to clipboard
        toast({
          title: "Partage non supporté",
          description: "Utilisez le bouton télécharger pour sauvegarder l'image",
        })
      }
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
        case '+':
        case '=':
          zoomIn()
          break
        case '-':
          zoomOut()
          break
        case '0':
          resetZoom()
          break
        case 'r':
          rotateClockwise()
          break
        case 'R':
          rotateCounterClockwise()
          break
        case 'f':
          setIsFullscreen(prev => !prev)
          break
        case 'i':
          setShowInfo(prev => !prev)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, images.length])

  if (!currentImage) return null

  const imageStyle = {
    transform: `scale(${zoom / 100}) rotate(${rotation}deg) translate(${imageTransform.x}px, ${imageTransform.y}px)`,
    transition: isDragging ? 'none' : 'transform 0.3s ease'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${
          isFullscreen 
            ? 'w-screen h-screen max-w-none m-0 rounded-none' 
            : 'max-w-6xl max-h-[90vh]'
        } bg-black border-gray-800 p-0 overflow-hidden`}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 bg-gray-900/50 backdrop-blur-sm relative z-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white">
              {currentImage.file.name}
              <span className="text-sm text-gray-400 ml-2">
                ({currentIndex + 1} / {images.length})
              </span>
            </DialogTitle>
            
            <div className="flex items-center space-x-2">
              {/* Info toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="text-gray-400 hover:text-white"
              >
                <Info className="w-4 h-4" />
              </Button>
              
              {/* Fullscreen toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-gray-400 hover:text-white"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
              
              {/* Close */}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Main content */}
        <div className="relative flex-1 bg-black">
          {/* Image container */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            <Image
              src={currentImage.optimized?.large || currentImage.preview}
              alt={currentImage.file.name}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain cursor-move"
              style={imageStyle}
              draggable={false}
              onMouseDown={(e) => {
                setIsDragging(true)
                const startX = e.clientX - imageTransform.x
                const startY = e.clientY - imageTransform.y

                const handleMouseMove = (e: MouseEvent) => {
                  setImageTransform({
                    x: e.clientX - startX,
                    y: e.clientY - startY
                  })
                }

                const handleMouseUp = () => {
                  setIsDragging(false)
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                }

                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }}
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={goToPrevious}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="lg"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={goToNext}
                  disabled={currentIndex === images.length - 1}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
          </div>

          {/* Info panel */}
          {showInfo && (
            <div className="absolute top-0 right-0 w-80 h-full bg-gray-900/90 backdrop-blur-sm p-6 overflow-y-auto">
              <h3 className="text-lg font-semibold text-white mb-4">Informations</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <label className="text-gray-400">Nom</label>
                  <p className="text-white">{currentImage.file.name}</p>
                </div>
                
                <div>
                  <label className="text-gray-400">Taille</label>
                  <p className="text-white">
                    {(currentImage.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                
                <div>
                  <label className="text-gray-400">Type</label>
                  <p className="text-white">{currentImage.file.type}</p>
                </div>
                
                <div>
                  <label className="text-gray-400">Dernière modification</label>
                  <p className="text-white">
                    {new Date(currentImage.file.lastModified).toLocaleDateString()}
                  </p>
                </div>
                
                {currentImage.optimized && (
                  <div>
                    <label className="text-gray-400">Versions optimisées</label>
                    <div className="mt-2 space-y-2">
                      <Badge variant="outline">Thumbnail (150×150)</Badge>
                      <Badge variant="outline">Medium (400×400)</Badge>
                      <Badge variant="outline">Large (800×800)</Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="px-6 py-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-800">
          <div className="flex items-center justify-between">
            {/* Zoom controls */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                disabled={zoom <= 25}
                className="text-gray-400 hover:text-white"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-2 min-w-[200px]">
                <span className="text-sm text-gray-400 w-10">{zoom}%</span>
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                  min={25}
                  max={500}
                  step={25}
                  className="flex-1"
                />
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                disabled={zoom >= 500}
                className="text-gray-400 hover:text-white"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetZoom}
                className="text-gray-400 hover:text-white text-xs"
              >
                Reset
              </Button>
            </div>

            {/* Rotation controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={rotateCounterClockwise}
                className="text-gray-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={rotateClockwise}
                className="text-gray-400 hover:text-white"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={shareImage}
                className="text-gray-400 hover:text-white"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadImage}
                className="text-gray-400 hover:text-white"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => onNavigate?.(image.id)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    image.id === currentImageId
                      ? 'border-gold-DEFAULT'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Image
                    src={image.optimized?.thumbnail || image.preview}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard shortcuts hint */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            Raccourcis: ←/→ Navigation • +/- Zoom • R Rotation • F Plein écran • I Infos • Esc Fermer
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 