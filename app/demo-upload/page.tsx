"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'
import { Upload, Image as ImageIcon, User, Gallery, CheckCircle, Code, Zap } from 'lucide-react'
import ImageUpload from '@/components/upload/image-upload'
import Image from 'next/image'

interface DemoImage {
  id: string
  url: string
  thumbnail: string
  medium: string
  large: string
  position: number
  isMain: boolean
}

export default function DemoUploadPage() {
  const [currentAvatar, setCurrentAvatar] = useState<string>('')
  const [galleryImages, setGalleryImages] = useState<DemoImage[]>([])
  const [uploadCount, setUploadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // Charger les images de démo
  const loadDemoGallery = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/upload/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'gallery' })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setGalleryImages(result.data)
        toast({
          title: 'Galerie chargée',
          description: `${result.data.length} images de démonstration`
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la galerie de démo',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarUpload = async (files: File[]) => {
    if (files.length === 0) return

    setLoading(true)
    
    try {
      // Simuler upload avec délai
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const response = await fetch('/api/upload/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'upload' })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setCurrentAvatar(result.data.url)
        setUploadCount(prev => prev + 1)
        
        toast({
          title: 'Avatar mis à jour',
          description: 'Upload simulé avec succès'
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la simulation',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGalleryUpload = async (files: File[]) => {
    if (files.length === 0) return

    setLoading(true)
    
    try {
      // Simuler upload avec délai
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newImages = files.map((file, index) => ({
        id: `uploaded-${Date.now()}-${index}`,
        url: `https://via.placeholder.com/800x600/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=Uploaded+${index + 1}`,
        thumbnail: `https://via.placeholder.com/150x150/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${index + 1}`,
        medium: `https://via.placeholder.com/400x300/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${index + 1}`,
        large: `https://via.placeholder.com/800x600/${Math.floor(Math.random()*16777215).toString(16)}/FFFFFF?text=${index + 1}`,
        position: galleryImages.length + index,
        isMain: galleryImages.length === 0 && index === 0
      }))
      
      setGalleryImages(prev => [...prev, ...newImages])
      setUploadCount(prev => prev + files.length)
      
      toast({
        title: 'Images ajoutées',
        description: `${files.length} image(s) simulée(s) avec succès`
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la simulation',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const deleteImage = (imageId: string) => {
    setGalleryImages(prev => prev.filter(img => img.id !== imageId))
    toast({
      title: 'Image supprimée',
      description: 'Simulation de suppression réussie'
    })
  }

  const setMainImage = (imageId: string) => {
    setGalleryImages(prev => 
      prev.map(img => ({
        ...img,
        isMain: img.id === imageId
      }))
    )
    toast({
      title: 'Image principale',
      description: 'Image définie comme principale'
    })
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Démonstration Upload Cloudinary</h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Découvrez le système d'upload d'images avancé de Le Papasito. Cette démonstration 
            simule toutes les fonctionnalités sans nécessiter de compte Cloudinary.
          </p>
          <div className="flex justify-center">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              Mode Démo - Aucune authentification requise
            </Badge>
          </div>
        </div>

        {/* Alert informatif */}
        <Alert>
          <Code className="h-4 w-4" />
          <AlertDescription>
            Cette démonstration utilise des images placeholder et simule les uploads. 
            En production, le système utilise Cloudinary pour un stockage et une optimisation réels.
          </AlertDescription>
        </Alert>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Uploads simulés</p>
                  <p className="text-2xl font-bold">{uploadCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Avatar</p>
                  <p className="text-2xl font-bold">{currentAvatar ? '✓' : '✗'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Gallery className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Images galerie</p>
                  <p className="text-2xl font-bold">{galleryImages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Composants d'upload */}
        <Card>
          <CardHeader>
            <CardTitle>Système d'Upload en Action</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="avatar" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="avatar">Upload Avatar</TabsTrigger>
                <TabsTrigger value="gallery">Galerie d'Images</TabsTrigger>
                <TabsTrigger value="features">Fonctionnalités</TabsTrigger>
              </TabsList>
              
              <TabsContent value="avatar" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Upload d'avatar</Badge>
                    <Badge variant="secondary">Compression automatique</Badge>
                    <Badge variant="secondary">Format optimisé</Badge>
                  </div>
                  
                  {/* Avatar actuel */}
                  {currentAvatar && (
                    <Card className="max-w-md">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={currentAvatar}
                            alt="Avatar demo"
                            width={80}
                            height={80}
                            className="rounded-full"
                          />
                          <div>
                            <h4 className="font-semibold">Avatar actuel</h4>
                            <p className="text-sm text-gray-600">400×400, WebP optimisé</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <ImageUpload
                    onUpload={handleAvatarUpload}
                    maxFiles={1}
                    maxSize={5}
                    multiple={false}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="gallery" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Galerie complète</Badge>
                    <Badge variant="secondary">Drag & Drop</Badge>
                    <Badge variant="secondary">Multi-upload</Badge>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={loadDemoGallery}
                      disabled={loading}
                      variant="outline"
                    >
                      Charger galerie démo
                    </Button>
                    <Button 
                      onClick={() => setGalleryImages([])}
                      disabled={galleryImages.length === 0}
                      variant="outline"
                    >
                      Vider galerie
                    </Button>
                  </div>
                  
                  {/* Galerie existante */}
                  {galleryImages.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Gallery className="w-5 h-5" />
                          <span>Galerie ({galleryImages.length} images)</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {galleryImages.map((image) => (
                            <div key={image.id} className="relative group">
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
                                      Principal
                                    </Badge>
                                  </div>
                                )}
                                
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-opacity flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                                    {!image.isMain && (
                                      <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => setMainImage(image.id)}
                                      >
                                        ⭐
                                      </Button>
                                    )}
                                    
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => deleteImage(image.id)}
                                    >
                                      🗑️
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <ImageUpload
                    onUpload={handleGalleryUpload}
                    maxFiles={10}
                    maxSize={10}
                    multiple={true}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">🎯 Fonctionnalités Core</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>✅ Upload drag & drop intuitif</li>
                        <li>✅ Validation fichiers (type, taille)</li>
                        <li>✅ Aperçu temps réel</li>
                        <li>✅ Progress tracking</li>
                        <li>✅ Gestion d'erreurs complète</li>
                        <li>✅ Interface responsive</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">⚡ Optimisations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>🔄 Compression automatique WebP</li>
                        <li>📐 Redimensionnement intelligent</li>
                        <li>🖼️ Multiples formats (thumb, medium, large)</li>
                        <li>🚀 CDN Cloudinary global</li>
                        <li>💾 Optimisation stockage</li>
                        <li>🔍 SEO-friendly URLs</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">🔐 Sécurité</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>🛡️ Authentification NextAuth.js</li>
                        <li>🚫 Validation types MIME</li>
                        <li>📏 Limites de taille strictes</li>
                        <li>🔒 Autorisations par utilisateur</li>
                        <li>🧹 Nettoyage automatique</li>
                        <li>📊 Audit trail complet</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">📱 UX/UI</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li>🎨 Design moderne & élégant</li>
                        <li>📱 100% mobile responsive</li>
                        <li>♿ Accessibilité complète</li>
                        <li>🌙 Support mode sombre</li>
                        <li>🎬 Animations fluides</li>
                        <li>💬 Feedback utilisateur clair</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer info */}
        <Card>
          <CardHeader>
            <CardTitle>🚀 Prêt pour la Production</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Ce système d'upload est maintenant intégré dans Le Papasito et prêt pour la production. 
              Il suffit de configurer Cloudinary pour remplacer les simulations par de vrais uploads.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">✅ Backend Services</Badge>
              <Badge variant="outline">✅ API Routes</Badge>
              <Badge variant="outline">✅ Frontend Components</Badge>
              <Badge variant="outline">✅ Database Models</Badge>
              <Badge variant="outline">✅ Security Layer</Badge>
              <Badge variant="outline">✅ Documentation</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 