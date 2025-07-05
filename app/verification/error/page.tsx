"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { XCircle, RefreshCw, ArrowLeft, Mail, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function VerificationError() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isResending, setIsResending] = useState(false)
  const [resendResult, setResendResult] = useState<{ success: boolean; message: string } | null>(null)

  const errorMessage = searchParams.get('message') || 'Erreur de vérification'

  const handleResendEmail = async () => {
    setIsResending(true)
    setResendResult(null)

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      setResendResult({
        success: data.success,
        message: data.message
      })

      if (data.success) {
        // Rediriger vers la page de vérification après 3 secondes
        setTimeout(() => {
          router.push('/verification')
        }, 3000)
      }
    } catch (error) {
      setResendResult({
        success: false,
        message: 'Erreur lors du renvoi de l\'email'
      })
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md bg-secondary border-border">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Erreur de vérification
          </CardTitle>
          <CardDescription className="text-base">
            Il y a eu un problème lors de la vérification de votre email.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-red-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              {errorMessage}
            </AlertDescription>
          </Alert>

          {resendResult && (
            <Alert className={resendResult.success ? 'border-green-200' : 'border-red-200'}>
              <AlertDescription className={resendResult.success ? 'text-green-800' : 'text-red-800'}>
                {resendResult.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Problèmes possibles :</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Le lien de vérification a expiré</li>
                <li>• Le lien a déjà été utilisé</li>
                <li>• Le lien est invalide ou corrompu</li>
              </ul>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Solutions :</p>
              <ul className="mt-2 space-y-1 text-left">
                <li>• Demandez un nouveau lien de vérification</li>
                <li>• Vérifiez votre boîte de réception</li>
                <li>• Contactez le support si le problème persiste</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleResendEmail}
              className="w-full"
              size="lg"
              disabled={isResending}
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Renvoyer l'email de vérification
                </>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push('/login')}
              className="w-full"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>
              Besoin d'aide ? {' '}
              <a href="mailto:support@lepapasito.com" className="text-primary hover:underline">
                Contactez le support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 