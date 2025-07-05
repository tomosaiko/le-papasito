"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { User, Camera, Loader2 } from 'lucide-react'
import ImageUpload from './image-upload'

interface AvatarUploadProps {
  currentAvatar?: string
  userName?: string
  onUpload?: (imageUrl: string) => void
  className?: string
}

export default function AvatarUpload({
  currentAvatar,
  userName,
  onUpload,
  className
}: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  const handleUpload = async (files: File[]) => {
    if (files.length === 0) return

    setUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', files[0])

      const response = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erreur lors de l\'upload')
      }

      const result = await response.json()
      
      if (result.success) {
        onUpload?.(result.data.url)
        setShowUpload(false)
        
        toast({
          title: 'Avatar mis à jour',
          description: 'Votre avatar a été mis à jour avec succès'
        })
      } else {
        throw new Error(result.error || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: `Impossible de mettre à jour l'avatar: ${error}`,
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  if (showUpload) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Changer d'avatar</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUpload(false)}
                disabled={uploading}
              >
                Annuler
              </Button>
            </div>
            
            <ImageUpload
              onUpload={handleUpload}
              maxFiles={1}
              maxSize={5}
              multiple={false}
              acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
            />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-32 h-32">
              <AvatarImage src={currentAvatar} alt={userName || 'Avatar'} />
              <AvatarFallback className="text-2xl">
                {userName ? userName.charAt(0).toUpperCase() : <User className="w-12 h-12" />}
              </AvatarFallback>
            </Avatar>
            
            <Button
              size="sm"
              className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0"
              onClick={() => setShowUpload(true)}
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-lg">{userName || 'Utilisateur'}</h3>
            <p className="text-sm text-gray-500">
              Cliquez sur l'icône pour changer votre avatar
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 