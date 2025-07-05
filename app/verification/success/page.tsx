"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, ArrowRight, User, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function VerificationSuccess() {
  const router = useRouter()

  useEffect(() => {
    // Redirection automatique après 10 secondes
    const timer = setTimeout(() => {
      router.push('/login')
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-md bg-secondary border-border">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Email vérifié !
          </CardTitle>
          <CardDescription className="text-base">
            Votre adresse email a été vérifiée avec succès. Votre compte est maintenant actif.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 p-4 bg-green-50 rounded-lg">
              <Mail className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">
                Votre email est maintenant vérifié
              </span>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Vous pouvez maintenant :</p>
              <ul className="mt-2 space-y-1">
                <li>• Accéder à toutes les fonctionnalités</li>
                <li>• Compléter votre profil</li>
                <li>• Rechercher des prestations</li>
                <li>• Prendre des rendez-vous</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/login')}
              className="w-full"
              size="lg"
            >
              Se connecter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => router.push('/dashboard')}
              className="w-full"
              size="lg"
            >
              <User className="w-4 h-4 mr-2" />
              Accéder au tableau de bord
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Redirection automatique dans 10 secondes...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 