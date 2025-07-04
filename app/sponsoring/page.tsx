"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Check, Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Vérifier si la clé publique Stripe est disponible
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
if (typeof window !== "undefined" && !stripePublicKey) {
  console.warn("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined")
}

const SponsoringPage = () => {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState("premium")
  const [adTitle, setAdTitle] = useState("")
  const [adDescription, setAdDescription] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string)
      }
      fileReader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!file) {
      setError("Veuillez télécharger une image pour votre annonce")
      setIsLoading(false)
      return
    }

    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append("file", file)
      formData.append("plan", selectedPlan)
      formData.append("title", adTitle)
      formData.append("description", adDescription)
      formData.append("email", contactEmail)
      formData.append("phone", contactPhone)

      // For now, we'll simulate this step
      const imageUrl = previewUrl

      // Then create a payment session with our API
      const response = await fetch("/api/payment/sponsoring", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: selectedPlan,
          metadata: {
            type: "sponsoring",
            title: adTitle,
            description: adDescription,
            imageUrl,
            email: contactEmail,
            phone: contactPhone,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erreur lors de la création de la session de paiement")
      }

      const { url } = await response.json()

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url
      } else {
        throw new Error("L'URL de paiement n'a pas été fournie")
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors du traitement du paiement")
    } finally {
      setIsLoading(false)
    }
  }

  const plans = [
    {
      id: "basic",
      name: "Basique",
      price: "99€",
      duration: "3 jours",
      features: ["Annonce en haut de la page d'accueil", "Visibilité standard", "Statistiques de base"],
    },
    {
      id: "premium",
      name: "Premium",
      price: "199€",
      duration: "7 jours",
      features: [
        "Annonce en haut de la page d'accueil",
        "Visibilité améliorée",
        "Statistiques détaillées",
        "Mise en avant sur les réseaux sociaux",
      ],
    },
    {
      id: "elite",
      name: "Élite",
      price: "399€",
      duration: "15 jours",
      features: [
        "Annonce en haut de la page d'accueil",
        "Visibilité maximale",
        "Statistiques avancées",
        "Mise en avant sur les réseaux sociaux",
        "Notification push aux utilisateurs",
        "Assistance prioritaire",
      ],
    },
  ]

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Sponsoring - Mettez votre annonce en avant</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Augmentez votre visibilité en plaçant votre annonce en haut de notre page d'accueil et attirez plus de clients
          potentiels.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <Card className={`border-2 ${selectedPlan === "basic" ? "border-primary" : "border-border"}`}>
          <CardHeader>
            <CardTitle>Basique</CardTitle>
            <CardDescription>Idéal pour commencer</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">99€</span>
              <span className="text-muted-foreground"> / 3 jours</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plans[0].features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant={selectedPlan === "basic" ? "default" : "outline"}
              className="w-full"
              onClick={() => setSelectedPlan("basic")}
            >
              {selectedPlan === "basic" ? "Sélectionné" : "Sélectionner"}
            </Button>
          </CardFooter>
        </Card>

        <Card className={`border-2 ${selectedPlan === "premium" ? "border-primary" : "border-border"}`}>
          <CardHeader>
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium w-fit mb-2">
              Populaire
            </div>
            <CardTitle>Premium</CardTitle>
            <CardDescription>Notre offre la plus populaire</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">199€</span>
              <span className="text-muted-foreground"> / 7 jours</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plans[1].features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant={selectedPlan === "premium" ? "default" : "outline"}
              className="w-full"
              onClick={() => setSelectedPlan("premium")}
            >
              {selectedPlan === "premium" ? "Sélectionné" : "Sélectionner"}
            </Button>
          </CardFooter>
        </Card>

        <Card className={`border-2 ${selectedPlan === "elite" ? "border-primary" : "border-border"}`}>
          <CardHeader>
            <CardTitle>Élite</CardTitle>
            <CardDescription>Visibilité maximale</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">399€</span>
              <span className="text-muted-foreground"> / 15 jours</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {plans[2].features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              variant={selectedPlan === "elite" ? "default" : "outline"}
              className="w-full"
              onClick={() => setSelectedPlan("elite")}
            >
              {selectedPlan === "elite" ? "Sélectionné" : "Sélectionner"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Détails de l'annonce</TabsTrigger>
            <TabsTrigger value="contact">Informations de contact</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="ad-title">Titre de l'annonce</Label>
                <Input
                  id="ad-title"
                  placeholder="Entrez le titre de votre annonce"
                  value={adTitle}
                  onChange={(e) => setAdTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-description">Description de l'annonce</Label>
                <Textarea
                  id="ad-description"
                  placeholder="Décrivez votre annonce en quelques mots"
                  rows={4}
                  value={adDescription}
                  onChange={(e) => setAdDescription(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ad-image">Image de l'annonce</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input type="file" id="ad-image" className="hidden" accept="image/*" onChange={handleFileChange} />
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-full h-48 mx-auto overflow-hidden rounded-lg">
                        <Image
                          src={previewUrl || "/placeholder.svg"}
                          alt="Aperçu de l'annonce"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("ad-image")?.click()}
                      >
                        Changer l'image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Glissez-déposez une image ou cliquez pour parcourir
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou GIF jusqu'à 5MB</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("ad-image")?.click()}
                      >
                        Sélectionner un fichier
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <Button type="button" onClick={() => document.querySelector('[data-value="contact"]')?.click()}>
                Continuer
              </Button>
            </TabsContent>
            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email de contact</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="votre@email.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Téléphone de contact</Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Forfait sélectionné</Label>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="flex flex-col space-y-2">
                  {plans.map((plan) => (
                    <div key={plan.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={plan.id} id={plan.id} />
                      <Label htmlFor={plan.id} className="flex-1">
                        {plan.name} - {plan.price} ({plan.duration})
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="pt-4 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.querySelector('[data-value="details"]')?.click()}
                >
                  Retour
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Traitement en cours..." : "Procéder au paiement"}
                </Button>
              </div>
            </TabsContent>
          </form>
        </Tabs>
      </div>

      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Pourquoi sponsoriser votre annonce ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Visibilité maximale</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Votre annonce sera affichée en haut de la page d'accueil, garantissant une visibilité maximale auprès de
                tous les visiteurs du site.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Plus de contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Les annonces sponsorisées reçoivent en moyenne 5 fois plus de contacts que les annonces standard.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Statistiques détaillées</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Accédez à des statistiques détaillées sur les performances de votre annonce : nombre de vues, clics, et
                contacts générés.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Contrôle total</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Personnalisez votre annonce avec votre propre titre, description et image pour maximiser son impact.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SponsoringPage
