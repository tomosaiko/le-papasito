"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, Upload, Camera, Shield, AlertCircle, ChevronRight } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface VerificationStepsProps {
  onComplete: () => void
}

export function VerificationSteps({ onComplete }: VerificationStepsProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(20)
  const [idFrontUploaded, setIdFrontUploaded] = useState(false)
  const [idBackUploaded, setIdBackUploaded] = useState(false)
  const [selfieUploaded, setSelfieUploaded] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

  const handleNextStep = () => {
    const nextStep = currentStep + 1
    setCurrentStep(nextStep)
    setProgress(nextStep * 20)

    if (nextStep > 5) {
      onComplete()
    }
  }

  const simulateVerification = () => {
    // Simuler une vérification réussie après 2 secondes
    setTimeout(() => {
      if (currentStep === 3) {
        setPhoneVerified(true)
      } else if (currentStep === 4) {
        setEmailVerified(true)
      }
    }, 2000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Vérification de votre compte</h2>
        <p className="text-muted-foreground mb-4">
          Complétez les étapes suivantes pour vérifier votre identité et obtenir le badge de vérification.
        </p>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Début</span>
          <span>Vérification complète</span>
        </div>
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Étape 1: Pourquoi se vérifier?
            </CardTitle>
            <CardDescription>Comprendre les avantages de la vérification de votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-secondary/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Avantages de la vérification
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Badge de vérification visible sur votre profil</li>
                <li>Plus de confiance auprès des utilisateurs</li>
                <li>Meilleur classement dans les résultats de recherche</li>
                <li>Accès à des fonctionnalités exclusives</li>
                <li>Protection contre les faux profils et les usurpations d'identité</li>
              </ul>
            </div>
            <div className="bg-yellow-500/10 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-yellow-600">
                <AlertCircle className="h-5 w-5" />
                Confidentialité et sécurité
              </h3>
              <p className="text-muted-foreground">
                Vos informations personnelles sont cryptées et sécurisées. Nous ne partageons jamais vos données avec
                des tiers sans votre consentement explicite.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
              Commencer la vérification <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-500" />
              Étape 2: Téléchargement des documents
            </CardTitle>
            <CardDescription>
              Téléchargez une pièce d'identité valide (carte d'identité, passeport ou permis de conduire)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id-front">Recto de la pièce d'identité</Label>
                <div
                  className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center ${idFrontUploaded ? "border-green-500 bg-green-50" : "border-border"}`}
                >
                  {idFrontUploaded ? (
                    <div className="flex flex-col items-center text-green-600">
                      <CheckCircle className="h-8 w-8 mb-2" />
                      <p>Document téléchargé</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Upload className="h-8 w-8 mb-2" />
                      <p>Cliquez ou glissez-déposez</p>
                      <p className="text-xs">JPG, PNG ou PDF (max 5MB)</p>
                    </div>
                  )}
                  <input id="id-front" type="file" className="hidden" onChange={() => setIdFrontUploaded(true)} />
                </div>
              </div>
              <div>
                <Label htmlFor="id-back">Verso de la pièce d'identité</Label>
                <div
                  className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center ${idBackUploaded ? "border-green-500 bg-green-50" : "border-border"}`}
                >
                  {idBackUploaded ? (
                    <div className="flex flex-col items-center text-green-600">
                      <CheckCircle className="h-8 w-8 mb-2" />
                      <p>Document téléchargé</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <Upload className="h-8 w-8 mb-2" />
                      <p>Cliquez ou glissez-déposez</p>
                      <p className="text-xs">JPG, PNG ou PDF (max 5MB)</p>
                    </div>
                  )}
                  <input id="id-back" type="file" className="hidden" onChange={() => setIdBackUploaded(true)} />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="selfie">Selfie avec votre pièce d'identité</Label>
              <div
                className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center ${selfieUploaded ? "border-green-500 bg-green-50" : "border-border"}`}
              >
                {selfieUploaded ? (
                  <div className="flex flex-col items-center text-green-600">
                    <CheckCircle className="h-8 w-8 mb-2" />
                    <p>Selfie téléchargé</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Camera className="h-8 w-8 mb-2" />
                    <p>Prenez un selfie en tenant votre pièce d'identité</p>
                    <p className="text-xs">
                      Assurez-vous que votre visage et les informations sur la pièce d'identité sont clairement visibles
                    </p>
                  </div>
                )}
                <input id="selfie" type="file" className="hidden" onChange={() => setSelfieUploaded(true)} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(1)
                setProgress(20)
              }}
            >
              Retour
            </Button>
            <Button
              onClick={handleNextStep}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!idFrontUploaded || !idBackUploaded || !selfieUploaded}
            >
              Continuer <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Étape 3: Vérification du téléphone
            </CardTitle>
            <CardDescription>
              Vérifiez votre numéro de téléphone pour renforcer la sécurité de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input id="phone" type="tel" placeholder="+33 6 12 34 56 78" />
            </div>
            {!phoneVerified ? (
              <div className="space-y-2">
                <Button onClick={simulateVerification} className="w-full bg-purple-600 hover:bg-purple-700">
                  Envoyer le code de vérification
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Un code à 6 chiffres sera envoyé par SMS à ce numéro
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="verification-code">Code de vérification</Label>
                <Input
                  id="verification-code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                />
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Numéro de téléphone vérifié</span>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(2)
                setProgress(40)
              }}
            >
              Retour
            </Button>
            <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700" disabled={!phoneVerified}>
              Continuer <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Étape 4: Vérification de l'email
            </CardTitle>
            <CardDescription>Vérifiez votre adresse email pour sécuriser votre compte</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input id="email" type="email" placeholder="votre.email@exemple.com" />
            </div>
            {!emailVerified ? (
              <div className="space-y-2">
                <Button onClick={simulateVerification} className="w-full bg-purple-600 hover:bg-purple-700">
                  Envoyer le lien de vérification
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Un lien de vérification sera envoyé à cette adresse email
                </p>
              </div>
            ) : (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Adresse email vérifiée</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(3)
                setProgress(60)
              }}
            >
              Retour
            </Button>
            <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700" disabled={!emailVerified}>
              Continuer <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-500" />
              Étape 5: Informations complémentaires
            </CardTitle>
            <CardDescription>
              Fournissez des informations supplémentaires pour compléter votre vérification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse complète</Label>
              <Textarea id="address" placeholder="Votre adresse complète" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Courte biographie</Label>
              <Textarea id="bio" placeholder="Parlez-nous un peu de vous..." />
            </div>
            <div className="bg-yellow-500/10 p-4 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-yellow-600">
                <AlertCircle className="h-5 w-5" />
                Note importante
              </h3>
              <p className="text-muted-foreground">
                Toutes les informations fournies seront vérifiées par notre équipe. La vérification peut prendre jusqu'à
                48 heures. Vous recevrez une notification par email une fois le processus terminé.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(4)
                setProgress(80)
              }}
            >
              Retour
            </Button>
            <Button onClick={handleNextStep} className="bg-purple-600 hover:bg-purple-700">
              Finaliser la vérification <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
