"use client"

import { useState } from "react"
import { PremiumModules } from "@/components/premium/premium-modules"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart, Activity, TrendingUp, Users, Eye, MousePointer, Calendar } from "lucide-react"

export default function PremiumDashboardPage() {
  const [currentModules, setCurrentModules] = useState<string[]>([])

  const handleSubscribe = async (modules: string[]) => {
    // Dans une implémentation réelle, vous enverriez ces données à votre API
    console.log("Subscribing to modules:", modules)

    // Simuler une mise à jour réussie
    setCurrentModules(modules)

    // Rediriger vers la page de paiement
    // window.location.href = "/dashboard/premium/payment"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Tableau de bord Premium</h1>
      <p className="text-muted-foreground mb-8">Gérez vos abonnements et suivez vos performances</p>

      <Tabs defaultValue="modules" className="space-y-8">
        <TabsList>
          <TabsTrigger value="modules">Modules Premium</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="space-y-6">
          <PremiumModules currentModules={currentModules} onSubscribe={handleSubscribe} />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-500" />
                  Vues du profil
                </CardTitle>
                <CardDescription>7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,248</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12.5% vs semaine précédente
                </div>
                <div className="h-[100px] mt-4 text-center text-muted-foreground text-sm">[Graphique des vues]</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MousePointer className="h-5 w-5 mr-2 text-purple-500" />
                  Clics sur le profil
                </CardTitle>
                <CardDescription>7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">386</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8.3% vs semaine précédente
                </div>
                <div className="h-[100px] mt-4 text-center text-muted-foreground text-sm">[Graphique des clics]</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-green-500" />
                  Réservations
                </CardTitle>
                <CardDescription>7 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">14</div>
                <div className="text-sm text-amber-600 flex items-center mt-1">
                  <Activity className="h-4 w-4 mr-1" />
                  -2.1% vs semaine précédente
                </div>
                <div className="h-[100px] mt-4 text-center text-muted-foreground text-sm">
                  [Graphique des réservations]
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-blue-500" />
                  Performances par jour
                </CardTitle>
                <CardDescription>Vues, clics et réservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] text-center text-muted-foreground">[Graphique des performances par jour]</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-purple-500" />
                  Sources de trafic
                </CardTitle>
                <CardDescription>D'où viennent vos visiteurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] text-center text-muted-foreground">[Graphique des sources de trafic]</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-green-500" />
                Performance globale
              </CardTitle>
              <CardDescription>Évolution de vos métriques clés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] text-center text-muted-foreground">[Graphique de performance globale]</div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Users className="h-5 w-5 mr-2 text-amber-500" />
                  Taux de conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.6%</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +0.5% vs mois précédent
                </div>
                <div className="h-[100px] mt-4 text-center text-muted-foreground text-sm">
                  [Graphique de conversion]
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-red-500" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">4.2/5</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +0.3 vs mois précédent
                </div>
                <div className="h-[100px] mt-4 text-center text-muted-foreground text-sm">[Graphique d'engagement]</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  Classement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">#12</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5 positions vs mois précédent
                </div>
                <div className="h-[100px] mt-4 text-center text-muted-foreground text-sm">
                  [Graphique de classement]
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
