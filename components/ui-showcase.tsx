"use client"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedCard, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/animated-card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Star, CheckCircle, Shield, Diamond } from "lucide-react"

export function UIShowcase() {
  return (
    <div className="container mx-auto py-12 space-y-12">
      <section className="space-y-4">
        <h2 className="purple-gradient">Palette de couleurs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-purple-500"></div>
            <p className="mt-2">Primary Purple</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-purple-700"></div>
            <p className="mt-2">Dark Purple</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-purple-300"></div>
            <p className="mt-2">Light Purple</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gold-DEFAULT"></div>
            <p className="mt-2">Gold Accent</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="purple-gradient">Typographie</h2>
        <div className="space-y-4">
          <h1>Titre principal (H1)</h1>
          <h2>Sous-titre (H2)</h2>
          <h3>Titre de section (H3)</h3>
          <h4>Titre de sous-section (H4)</h4>
          <p className="text-lg">Texte large</p>
          <p>Texte normal</p>
          <p className="text-sm">Texte petit</p>
          <p className="text-xs">Texte très petit</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="purple-gradient">Boutons avec micro-interactions</h2>
        <div className="flex flex-wrap gap-4">
          <AnimatedButton variant="default">Bouton standard</AnimatedButton>
          <AnimatedButton variant="purple" animation="pulse">
            Bouton pulsant
          </AnimatedButton>
          <AnimatedButton variant="gold" animation="glow">
            Bouton brillant
          </AnimatedButton>
          <AnimatedButton variant="outline" animation="bounce">
            Bouton rebondissant
          </AnimatedButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="purple-gradient">Cartes avec animations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatedCard animation="hover">
            <CardHeader>
              <CardTitle>Carte standard</CardTitle>
              <CardDescription>Avec animation au survol</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Survolez cette carte pour voir l'effet de soulèvement.</p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard variant="premium" animation="glow">
            <CardHeader>
              <CardTitle>Carte premium</CardTitle>
              <CardDescription>Avec effet de lueur</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Survolez cette carte pour voir l'effet de lueur violette.</p>
            </CardContent>
          </AnimatedCard>

          <AnimatedCard variant="gold" animation="pulse">
            <CardHeader>
              <CardTitle>Carte gold</CardTitle>
              <CardDescription>Avec effet de pulsation</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Survolez cette carte pour voir l'effet de pulsation.</p>
            </CardContent>
          </AnimatedCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="purple-gradient">Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="premium" className="flex items-center gap-1">
            <Diamond className="h-3 w-3" />
            Premium
          </Badge>
          <Badge variant="gold" className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            Gold
          </Badge>
          <Badge variant="verified" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Vérifié
          </Badge>
          <Badge variant="safesex" className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            Safe Sex
          </Badge>
          <Badge variant="premium" animation="pulse">
            Nouveau
          </Badge>
          <Badge variant="gold" animation="glow">
            Populaire
          </Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="purple-gradient">Mode sombre/clair</h2>
        <div className="flex items-center gap-4">
          <p>Basculer entre les modes:</p>
          <ThemeToggle />
        </div>
      </section>
    </div>
  )
}
