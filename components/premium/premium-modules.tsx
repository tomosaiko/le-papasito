"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Diamond, ArrowUp, ImageIcon, MapPin, Package, Info, AlertCircle } from "lucide-react"
import { formatPrice } from "@/lib/payment/commission"

interface PremiumModulesProps {
  currentModules?: string[]
  onSubscribe?: (modules: string[]) => void
}

export function PremiumModules({ currentModules = [], onSubscribe }: PremiumModulesProps) {
  const [selectedModules, setSelectedModules] = useState<string[]>(currentModules)
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly")

  // Définition des modules premium
  const modules = [
    {
      id: "gold",
      name: "Profil Gold",
      icon: <Star className="h-5 w-5 text-yellow-500" />,
      price: { monthly: 19, annual: 190 },
      description: "Badge Gold, meilleur classement, avis mis en avant",
      features: [
        "Badge Gold sur votre profil",
        "Meilleur classement dans les résultats de recherche",
        "Avis clients mis en avant",
        "Statistiques de base (vues, clics)",
      ],
    },
    {
      id: "premium",
      name: "Profil Premium",
      icon: <Diamond className="h-5 w-5 text-purple-500" />,
      price: { monthly: 39, annual: 390 },
      description: "Badge Premium, top résultats, stats avancées, homepage, bouton CTA",
      features: [
        "Badge Premium exclusif",
        "Positionnement en tête des résultats",
        "Statistiques avancées et analytics",
        "Apparition sur la page d'accueil",
        "Bouton d'appel à l'action personnalisé",
        "Inclut tous les avantages Gold",
      ],
    },
    {
      id: "top",
      name: "Top de page",
      icon: <ArrowUp className="h-5 w-5 text-blue-500" />,
      price: { monthly: 29, annual: 290 },
      description: "Mise en haut des résultats de recherche pendant 30 jours",
      features: [
        "Positionnement en tête des résultats de recherche",
        "Visibilité maximale pendant 30 jours",
        "Rotation prioritaire dans les suggestions",
      ],
    },
    {
      id: "boost",
      name: "Boost 24h",
      icon: <ArrowUp className="h-5 w-5 text-green-500" />,
      price: { monthly: 5, annual: 50 },
      description: "Mise en avant temporaire sur la page d'accueil pendant 24h",
      features: [
        "Visibilité accrue pendant 24h",
        "Apparition sur la page d'accueil",
        "Notification aux utilisateurs intéressés",
      ],
    },
    {
      id: "photos",
      name: "+10 photos",
      icon: <ImageIcon className="h-5 w-5 text-pink-500" />,
      price: { monthly: 9, annual: 90 },
      description: "Possibilité d'ajouter jusqu'à 20 photos au profil",
      features: ["Jusqu'à 20 photos sur votre profil", "Galerie photo améliorée", "Meilleure présentation visuelle"],
    },
    {
      id: "local",
      name: "Épinglage local",
      icon: <MapPin className="h-5 w-5 text-red-500" />,
      price: { monthly: 14, annual: 140 },
      description: "Mise en avant dans les recherches géolocalisées",
      features: [
        "Priorité dans les recherches locales",
        "Visibilité accrue dans votre zone",
        "Badge de localisation spécial",
      ],
    },
    {
      id: "premium-plus",
      name: "Pack Premium+",
      icon: <Package className="h-5 w-5 text-indigo-500" />,
      price: { monthly: 59, annual: 590 },
      description: "Inclut Profil Premium + Boost 24h/semaine + Top 7j/mois",
      features: [
        "Tous les avantages du Profil Premium",
        "Boost 24h automatique chaque semaine",
        "Top de page pendant 7 jours chaque mois",
        "Économisez plus de 30% par rapport aux modules séparés",
      ],
      isBundle: true,
    },
  ]

  // Calculer le prix total
  const calculateTotalPrice = () => {
    let total = 0
    let discount = 0

    // Si Premium+ est sélectionné, ignorer les modules individuels inclus
    if (selectedModules.includes("premium-plus")) {
      const premiumPlusModule = modules.find((m) => m.id === "premium-plus")
      if (premiumPlusModule) {
        total += premiumPlusModule.price[billingPeriod]
      }

      // Ajouter les modules non inclus dans Premium+
      const nonIncludedModules = selectedModules.filter(
        (id) => !["premium-plus", "premium", "boost", "top"].includes(id),
      )

      nonIncludedModules.forEach((id) => {
        const module = modules.find((m) => m.id === id)
        if (module) {
          total += module.price[billingPeriod]
        }
      })
    }
    // Si Gold et Premium sont tous deux sélectionnés, appliquer une réduction
    else if (selectedModules.includes("gold") && selectedModules.includes("premium")) {
      // Ne pas compter Gold car il est inclus dans Premium
      discount += modules.find((m) => m.id === "gold")?.price[billingPeriod] || 0

      selectedModules.forEach((id) => {
        const module = modules.find((m) => m.id === id)
        if (module) {
          total += module.price[billingPeriod]
        }
      })

      total -= discount
    }
    // Cas standard: additionner tous les modules sélectionnés
    else {
      selectedModules.forEach((id) => {
        const module = modules.find((m) => m.id === id)
        if (module) {
          total += module.price[billingPeriod]
        }
      })
    }

    return { total, discount }
  }

  const { total, discount } = calculateTotalPrice()

  // Gérer la sélection/désélection d'un module
  const toggleModule = (moduleId: string) => {
    if (selectedModules.includes(moduleId)) {
      // Si on désélectionne Premium+, désélectionner aussi les modules inclus
      if (moduleId === "premium-plus") {
        setSelectedModules(selectedModules.filter((id) => id !== moduleId))
      } else {
        setSelectedModules(selectedModules.filter((id) => id !== moduleId))
      }
    } else {
      // Si on sélectionne Premium+, désélectionner les modules individuels inclus
      if (moduleId === "premium-plus") {
        const newSelection = selectedModules.filter((id) => !["premium", "boost", "top"].includes(id))
        setSelectedModules([...newSelection, moduleId])
      }
      // Si on sélectionne Premium, désélectionner Gold car il est inclus
      else if (moduleId === "premium") {
        const newSelection = selectedModules.filter((id) => id !== "gold")
        setSelectedModules([...newSelection, moduleId])
      } else {
        setSelectedModules([...selectedModules, moduleId])
      }
    }
  }

  // Gérer la souscription
  const handleSubscribe = () => {
    if (onSubscribe) {
      onSubscribe(selectedModules)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Modules Premium</h2>
          <p className="text-muted-foreground">Boostez votre visibilité et maximisez vos revenus</p>
        </div>

        <div className="flex items-center space-x-2 bg-secondary/50 p-2 rounded-lg">
          <Label
            htmlFor="billing-period"
            className={billingPeriod === "monthly" ? "text-foreground" : "text-muted-foreground"}
          >
            Mensuel
          </Label>
          <Switch
            id="billing-period"
            checked={billingPeriod === "annual"}
            onCheckedChange={(checked) => setBillingPeriod(checked ? "annual" : "monthly")}
          />
          <Label
            htmlFor="billing-period"
            className={billingPeriod === "annual" ? "text-foreground" : "text-muted-foreground"}
          >
            Annuel{" "}
            <Badge variant="outline" className="ml-1 text-xs">
              -17%
            </Badge>
          </Label>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">Tous les modules</TabsTrigger>
          <TabsTrigger value="popular">Populaires</TabsTrigger>
          <TabsTrigger value="bundles">Packs</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <Card
                key={module.id}
                className={`cursor-pointer transition-all ${
                  selectedModules.includes(module.id) ? "border-purple-500 shadow-md" : "hover:border-gray-400"
                }`}
                onClick={() => toggleModule(module.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {module.icon}
                      <CardTitle className="text-lg ml-2">{module.name}</CardTitle>
                    </div>
                    {selectedModules.includes(module.id) && (
                      <div className="bg-purple-100 dark:bg-purple-900/30 w-6 h-6 rounded-full flex items-center justify-center">
                        <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                    )}
                  </div>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold">{formatPrice(module.price[billingPeriod], "EUR")}</span>
                    <span className="text-muted-foreground ml-1 text-sm">
                      /{billingPeriod === "monthly" ? "mois" : "an"}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {module.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    {module.features.length > 3 && (
                      <li className="text-sm text-purple-500 hover:underline cursor-pointer flex items-center">
                        <Info className="h-4 w-4 mr-1" />
                        Voir plus de détails
                      </li>
                    )}
                  </ul>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules
              .filter((m) => ["gold", "premium", "top", "boost"].includes(m.id))
              .map((module) => (
                <Card
                  key={module.id}
                  className={`cursor-pointer transition-all ${
                    selectedModules.includes(module.id) ? "border-purple-500 shadow-md" : "hover:border-gray-400"
                  }`}
                  onClick={() => toggleModule(module.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {module.icon}
                        <CardTitle className="text-lg ml-2">{module.name}</CardTitle>
                      </div>
                      {selectedModules.includes(module.id) && (
                        <div className="bg-purple-100 dark:bg-purple-900/30 w-6 h-6 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold">{formatPrice(module.price[billingPeriod], "EUR")}</span>
                      <span className="text-muted-foreground ml-1 text-sm">
                        /{billingPeriod === "monthly" ? "mois" : "an"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      {module.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="bundles" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules
              .filter((m) => m.isBundle)
              .map((module) => (
                <Card
                  key={module.id}
                  className={`cursor-pointer transition-all ${
                    selectedModules.includes(module.id) ? "border-purple-500 shadow-md" : "hover:border-gray-400"
                  }`}
                  onClick={() => toggleModule(module.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {module.icon}
                        <CardTitle className="text-lg ml-2">{module.name}</CardTitle>
                      </div>
                      {selectedModules.includes(module.id) && (
                        <div className="bg-purple-100 dark:bg-purple-900/30 w-6 h-6 rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                      )}
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold">{formatPrice(module.price[billingPeriod], "EUR")}</span>
                      <span className="text-muted-foreground ml-1 text-sm">
                        /{billingPeriod === "monthly" ? "mois" : "an"}
                      </span>
                    </div>

                    <div className="bg-secondary/50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-medium">Inclus dans ce pack:</p>
                      <ul className="text-sm space-y-1 mt-2">
                        <li className="flex items-center">
                          <Diamond className="h-4 w-4 text-purple-500 mr-2" />
                          <span>Profil Premium (39€/mois)</span>
                        </li>
                        <li className="flex items-center">
                          <ArrowUp className="h-4 w-4 text-green-500 mr-2" />
                          <span>Boost 24h hebdomadaire (20€/mois)</span>
                        </li>
                        <li className="flex items-center">
                          <ArrowUp className="h-4 w-4 text-blue-500 mr-2" />
                          <span>Top de page 7j/mois (10€/mois)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900">
                      <p className="text-sm text-green-800 dark:text-green-300 flex items-center">
                        <Check className="h-4 w-4 mr-2" />
                        Économisez plus de 30% par rapport aux modules séparés
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-secondary/50 p-4 rounded-lg border border-border">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h3 className="font-medium">Récapitulatif</h3>
            <p className="text-sm text-muted-foreground">Modules sélectionnés: {selectedModules.length}</p>
          </div>
          <div className="text-right mt-2 sm:mt-0">
            <div className="text-2xl font-bold">{formatPrice(total, "EUR")}</div>
            <div className="text-sm text-muted-foreground">{billingPeriod === "monthly" ? "par mois" : "par an"}</div>
          </div>
        </div>

        {selectedModules.length > 0 && (
          <div className="space-y-2 mb-4">
            {selectedModules.map((id) => {
              const module = modules.find((m) => m.id === id)
              return module ? (
                <div key={id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    {module.icon}
                    <span className="ml-2">{module.name}</span>
                  </div>
                  <span>{formatPrice(module.price[billingPeriod], "EUR")}</span>
                </div>
              ) : null
            })}

            {discount > 0 && (
              <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-400 border-t border-border pt-2">
                <span>Réduction (Gold inclus dans Premium)</span>
                <span>-{formatPrice(discount, "EUR")}</span>
              </div>
            )}
          </div>
        )}

        {selectedModules.length === 0 && (
          <div className="flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">Aucun module sélectionné</p>
          </div>
        )}

        <Button
          onClick={handleSubscribe}
          disabled={selectedModules.length === 0}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          S'abonner maintenant
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-2">
          Vous pouvez modifier ou annuler votre abonnement à tout moment
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Offre spéciale nouveaux membres</h3>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Inscrivez-vous maintenant et bénéficiez d'un mois Gold gratuit pour tester nos services premium!
        </p>
      </div>
    </div>
  )
}
