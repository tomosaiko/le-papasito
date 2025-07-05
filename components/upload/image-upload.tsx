"use client"

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, Trash2, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import Image from 'next/image'

interface ImageUploadProps {
  onUpload: (files: File[]) => Promise<void>
  maxFiles?: number
  maxSize?: number // en MB
  acceptedTypes?: string[]
  multiple?: boolean
  children?: React.ReactNode
  className?: string
  previewMode?: boolean
}

interface FilePreview {
  file: File
  preview: string
  id: string
}

export default function ImageUpload({
  onUpload,
  maxFiles = 10,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  multiple = true,
  children,
  className,
  previewMode = true
}: ImageUploadProps) {
  const [files, setFiles] = useState<FilePreview[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const uploadRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)

    // Gérer les fichiers rejetés
    if (rejectedFiles.length > 0) {
      const errorMessages = rejectedFiles.map(({ file, errors }) => {
        const errorTypes = errors.map((e: any) => e.code).join(', ')
        return `${file.name}: ${errorTypes}`
      }).join('; ')
      
      setError(`Fichiers rejetés: ${errorMessages}`)
      return
    }

    // Vérifier le nombre maximum de fichiers
    if (files.length + acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} fichiers autorisés`)
      return
    }

    // Créer les previews
    const newFiles: FilePreview[] = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }))

    setFiles(prev => [...prev, ...newFiles])
  }, [files, maxFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxFiles: multiple ? maxFiles : 1,
    maxSize: maxSize * 1024 * 1024, // Convertir en bytes
    multiple,
    disabled: uploading
  })

  const removeFile = (id: string) => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id)
      // Nettoyer les URLs d'aperçu
      const removed = prev.find(f => f.id === id)
      if (removed) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Aucun fichier sélectionné')
      return
    }

    setUploading(true)
    setUploadProgress(0)
    setError(null)

    try {
      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      await onUpload(files.map(f => f.file))
      
      setUploadProgress(100)
      clearInterval(progressInterval)
      
      // Nettoyer les fichiers
      files.forEach(file => URL.revokeObjectURL(file.preview))
      setFiles([])
      
      toast({
        title: 'Upload réussi',
        description: `${files.length} fichier(s) uploadé(s) avec succès`,
      })
    } catch (error) {
      setError(`Erreur d'upload: ${error}`)
      toast({
        title: 'Erreur d\'upload',
        description: `Impossible d'uploader les fichiers: ${error}`,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const clearAll = () => {
    files.forEach(file => URL.revokeObjectURL(file.preview))
    setFiles([])
    setError(null)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Zone de drop */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive && 'border-blue-500 bg-blue-50',
              uploading && 'cursor-not-allowed opacity-50'
            )}
          >
            <input {...getInputProps()} ref={uploadRef} />
            
            {children || (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-gray-400" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {isDragActive 
                      ? 'Déposez les fichiers ici...' 
                      : 'Glissez-déposez vos images ici'
                    }
                  </p>
                  <p className="text-sm text-gray-500">
                    ou cliquez pour sélectionner
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="secondary">
                    Max {maxFiles} fichier{maxFiles > 1 ? 's' : ''}
                  </Badge>
                  <Badge variant="secondary">
                    Max {maxSize}MB par fichier
                  </Badge>
                  <Badge variant="secondary">
                    {acceptedTypes.map(type => type.split('/')[1]).join(', ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Erreur */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Progrès d'upload */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Upload en cours...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {/* Aperçu des fichiers */}
      {files.length > 0 && previewMode && (
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">
                {files.length} fichier{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                disabled={uploading}
              >
                Tout supprimer
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <div key={file.id} className="relative group">
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={file.preview}
                      alt={file.file.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFile(file.id)}
                        disabled={uploading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium truncate" title={file.file.name}>
                      {file.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Boutons d'action */}
      {files.length > 0 && (
        <div className="flex gap-2">
          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Uploader {files.length} fichier{files.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={clearAll}
            disabled={uploading}
          >
            Annuler
          </Button>
        </div>
      )}
    </div>
  )
} 