"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ImageUpload from '@/components/upload/image-upload'
import AvatarUpload from '@/components/upload/avatar-upload'
import GalleryUpload from '@/components/upload/gallery-upload'
import { toast } from '@/hooks/use-toast'
import { Upload, Image as ImageIcon, User, Gallery } from 'lucide-react'

export default function TestUploadPage() {
  const [currentAvatar, setCurrentAvatar] = useState<string>('')
  const [uploadCount, setUploadCount] = useState(0)

  const handleGenericUpload = async (files: File[]) => {
    // Simulation d'upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setUploadCount(prev => prev + files.length)
    
    toast({
      title: 'Upload simulé réussi',
      description: `${files.length} fichier(s) uploadé(s) avec succès`
    })
  }

  const handleAvatarUpload = (imageUrl: string) => {
    setCurrentAvatar(imageUrl)
    toast({
      title: 'Avatar mis à jour',
      description: 'Votre avatar a été mis à jour avec succès'
    })
  }

  const testCloudinaryConnection = async () => {
    try {
      const response = await fetch('/api/upload/test', {
        method: 'POST'
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast({
          title: 'Test réussi',
          description: 'La connexion Cloudinary fonctionne correctement'
        })
      } else {
        toast({
          title: 'Test échoué',
          description: result.error || 'Erreur lors du test',
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur de connexion',
        description: 'Impossible de tester la connexion Cloudinary',
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <ImageIcon className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Test Upload d'Images</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Page de test pour valider le système d'upload d'images avec Cloudinary.
            Testez les différents composants et fonctionnalités disponibles.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Uploads testés</p>
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
                  <p className="text-sm text-gray-600">Galerie</p>
                  <p className="text-2xl font-bold">Test</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Test de connexion Cloudinary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Cliquez sur le bouton ci-dessous pour tester la connexion avec Cloudinary
                et valider la configuration.
              </p>
              <Button onClick={testCloudinaryConnection} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Tester la connexion Cloudinary
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Composants d'upload */}
        <Card>
          <CardHeader>
            <CardTitle>Composants d'Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="generic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="generic">Upload Générique</TabsTrigger>
                <TabsTrigger value="avatar">Avatar</TabsTrigger>
                <TabsTrigger value="gallery">Galerie</TabsTrigger>
              </TabsList>
              
              <TabsContent value="generic" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Composant générique</Badge>
                    <Badge variant="secondary">Multi-fichiers</Badge>
                  </div>
                  <ImageUpload
                    onUpload={handleGenericUpload}
                    maxFiles={5}
                    maxSize={10}
                    multiple={true}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="avatar" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Avatar utilisateur</Badge>
                    <Badge variant="secondary">Fichier unique</Badge>
                  </div>
                  <AvatarUpload
                    currentAvatar={currentAvatar}
                    userName="Utilisateur Test"
                    onUpload={handleAvatarUpload}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="gallery" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Galerie d'images</Badge>
                    <Badge variant="secondary">Gestion complète</Badge>
                  </div>
                  <GalleryUpload />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Informations techniques */}
        <Card>
          <CardHeader>
            <CardTitle>Informations techniques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Formats supportés</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">JPEG</Badge>
                    <Badge variant="outline">PNG</Badge>
                    <Badge variant="outline">WebP</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Limitations</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Taille max: 10MB par fichier</li>
                    <li>• Avatar: 5MB max</li>
                    <li>• Galerie: 10 fichiers max</li>
                  </ul>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Fonctionnalités</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Drag & Drop</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Compression automatique</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">URLs optimisées</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Validation sécurisée</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 