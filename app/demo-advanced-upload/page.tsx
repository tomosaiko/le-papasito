"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'
import { 
  Sparkles, 
  Camera, 
  Images, 
  Zap, 
  Shield, 
  Smartphone,
  Gauge,
  Palette,
  Code
} from 'lucide-react'
import AdvancedImageUpload from '@/components/upload/advanced-image-upload'
import ImagePreviewModal from '@/components/upload/image-preview-modal'

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

export default function DemoAdvancedUploadPage() {
  const [avatarImages, setAvatarImages] = useState<UploadedImage[]>([])
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([])
  const [allImages, setAllImages] = useState<UploadedImage[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleAvatarUpload = (images: UploadedImage[]) => {
    setAvatarImages(images)
    toast({
      title: "Avatar mis à jour",
      description: `${images.length} image(s) uploadée(s) pour l'avatar`,
    })
  }

  const handleGalleryUpload = (images: UploadedImage[]) => {
    setGalleryImages(images)
    toast({
      title: "Galerie mise à jour",
      description: `${images.length} image(s) uploadée(s) dans la galerie`,
    })
  }

  const handleAllImagesUpload = (images: UploadedImage[]) => {
    setAllImages(images)
    toast({
      title: "Images uploadées",
      description: `${images.length} image(s) uploadée(s) avec succès`,
    })
  }

  const openPreview = (imageId: string) => {
    setPreviewImage(imageId)
    setIsPreviewOpen(true)
  }

  const features = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Drag & Drop Avancé",
      description: "Interface intuitive avec animations fluides et feedback visuel en temps réel",
      color: "bg-blue-500"
    },
    {
      icon: <Gauge className="w-6 h-6" />,
      title: "Progress Tracking",
      description: "Suivi du progress d'upload en temps réel avec gestion d'erreurs automatique",
      color: "bg-green-500"
    },
    {
      icon: <Images className="w-6 h-6" />,
      title: "Prévisualisation Complète",
      description: "Modal de prévisualisation avec zoom, rotation, navigation et raccourcis clavier",
      color: "bg-purple-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Optimisation Auto",
      description: "Génération automatique de plusieurs tailles (thumbnail, medium, large)",
      color: "bg-yellow-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Validation Sécurisée",
      description: "Contrôle strict des types de fichiers et tailles avec messages d'erreur clairs",
      color: "bg-red-500"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Responsive Design",
      description: "Interface parfaitement adaptée mobile avec touch gestures",
      color: "bg-cyan-500"
    }
  ]

  const stats = [
    {
      label: "Images Avatar",
      value: avatarImages.filter(img => img.status === 'success').length,
      total: avatarImages.length,
      color: "text-blue-400"
    },
    {
      label: "Images Galerie", 
      value: galleryImages.filter(img => img.status === 'success').length,
      total: galleryImages.length,
      color: "text-purple-400"
    },
    {
      label: "Toutes Images",
      value: allImages.filter(img => img.status === 'success').length,
      total: allImages.length,
      color: "text-green-400"
    },
    {
      label: "Total Succès",
      value: [...avatarImages, ...galleryImages, ...allImages].filter(img => img.status === 'success').length,
      total: [...avatarImages, ...galleryImages, ...allImages].length,
      color: "text-gold-DEFAULT"
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-4">
        {/* Hero Section */}
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 bg-gold-DEFAULT/10 border border-gold-DEFAULT/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-gold-DEFAULT" />
            <span className="text-gold-DEFAULT font-medium">Composants Upload Avancés</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Système d'Upload
            <span className="block bg-gradient-to-r from-gold-DEFAULT to-yellow-400 bg-clip-text text-transparent">
              Nouvelle Génération
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Découvrez notre système d'upload d'images révolutionnaire avec drag & drop avancé, 
            prévisualisation complète, optimisation automatique et une UX exceptionnelle.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="px-4 py-2 border-gray-700 text-gray-300"
              >
                <div className={`w-3 h-3 rounded-full ${feature.color} mr-2`}></div>
                {feature.title}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800">
              <CardContent className="p-6 text-center">
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                  {stat.total > 0 && (
                    <span className="text-lg text-gray-500">/{stat.total}</span>
                  )}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`${feature.color} p-3 rounded-lg`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Demo Sections */}
        <Tabs defaultValue="avatar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-gray-800">
            <TabsTrigger value="avatar" className="flex items-center gap-2 data-[state=active]:bg-gold-DEFAULT data-[state=active]:text-black">
              <Camera className="h-4 w-4" />
              Upload Avatar
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2 data-[state=active]:bg-gold-DEFAULT data-[state=active]:text-black">
              <Images className="h-4 w-4" />
              Galerie Multiple
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2 data-[state=active]:bg-gold-DEFAULT data-[state=active]:text-black">
              <Zap className="h-4 w-4" />
              Fonctionnalités Avancées
            </TabsTrigger>
          </TabsList>

          {/* Avatar Upload Demo */}
          <TabsContent value="avatar" className="mt-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-blue-400" />
                  Upload d'Avatar Avancé
                </CardTitle>
                <Alert className="bg-blue-900/20 border-blue-700">
                  <Camera className="h-4 w-4" />
                  <AlertDescription className="text-blue-300">
                    Parfait pour les photos de profil avec optimisation automatique et crop intelligent.
                    Limite: 1 image, 5MB max, détection de visage activée.
                  </AlertDescription>
                </Alert>
              </CardHeader>
              <CardContent>
                <AdvancedImageUpload
                  maxFiles={1}
                  maxSize={5}
                  onUpload={handleAvatarUpload}
                  showPreview={true}
                  enableOptimization={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Upload Demo */}
          <TabsContent value="gallery" className="mt-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Images className="w-5 h-5 text-purple-400" />
                  Upload de Galerie Multiple
                </CardTitle>
                <Alert className="bg-purple-900/20 border-purple-700">
                  <Images className="h-4 w-4" />
                  <AlertDescription className="text-purple-300">
                    Idéal pour les galeries d'images avec réorganisation et gestion avancée.
                    Limite: 10 images, 10MB max par image, optimisation WebP.
                  </AlertDescription>
                </Alert>
              </CardHeader>
              <CardContent>
                <AdvancedImageUpload
                  maxFiles={10}
                  maxSize={10}
                  onUpload={handleGalleryUpload}
                  showPreview={true}
                  enableOptimization={true}
                  enableCrop={true}
                />

                {/* Preview buttons */}
                {galleryImages.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-white font-medium mb-3">Actions rapides :</h4>
                    <div className="flex flex-wrap gap-2">
                      {galleryImages.map((image) => (
                        <Button
                          key={image.id}
                          variant="outline"
                          size="sm"
                          onClick={() => openPreview(image.id)}
                          className="border-gray-700 text-gray-300 hover:border-gold-DEFAULT hover:text-gold-DEFAULT"
                        >
                          Prévisualiser {image.file.name.substring(0, 10)}...
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Features Demo */}
          <TabsContent value="advanced" className="mt-8">
            <div className="space-y-6">
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    Upload avec Toutes les Fonctionnalités
                  </CardTitle>
                  <Alert className="bg-yellow-900/20 border-yellow-700">
                    <Zap className="h-4 w-4" />
                    <AlertDescription className="text-yellow-300">
                      Démonstration complète avec toutes les fonctionnalités avancées activées.
                      Testez le drag & drop, les animations, la validation et l'optimisation.
                    </AlertDescription>
                  </Alert>
                </CardHeader>
                <CardContent>
                  <AdvancedImageUpload
                    maxFiles={15}
                    maxSize={20}
                    onUpload={handleAllImagesUpload}
                    showPreview={true}
                    enableOptimization={true}
                    enableCrop={true}
                  />
                </CardContent>
              </Card>

              {/* Technical Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Code className="w-5 h-5 text-green-400" />
                      Fonctionnalités Techniques
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Drag & Drop API</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        ✓ Activé
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Progress Tracking</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        ✓ Temps réel
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Validation Fichiers</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        ✓ Type & Taille
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Optimisation Images</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        ✓ WebP Auto
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Gestion Erreurs</span>
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                        ✓ Toast Messages
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Palette className="w-5 h-5 text-purple-400" />
                      UX & Design
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Animations Fluides</span>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                        ✓ CSS Transitions
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Responsive Design</span>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                        ✓ Mobile First
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Dark Theme</span>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                        ✓ Premium Look
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Micro-interactions</span>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                        ✓ Hover & Focus
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Accessibilité</span>
                      <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                        ✓ ARIA Labels
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal de prévisualisation */}
        <ImagePreviewModal
          images={allImages.length > 0 ? allImages : galleryImages}
          currentImageId={previewImage}
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false)
            setPreviewImage(null)
          }}
          onNavigate={(imageId) => setPreviewImage(imageId)}
        />
      </div>
    </div>
  )
} 