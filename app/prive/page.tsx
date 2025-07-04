"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Home, ChevronRight } from "lucide-react"

export default function PrivePage() {
  const categories = [
    { name: "Femmes", href: "/prive/femmes", description: "Annonces de femmes qui reçoivent chez eux" },
    { name: "Gigolo", href: "/prive/gigolo", description: "Annonces d'hommes qui reçoivent chez eux" },
    { name: "Trans", href: "/prive/trans", description: "Annonces de trans qui reçoivent chez eux" },
    { name: "Fétiche", href: "/prive/fetiche", description: "Annonces de services fétichistes" },
    { name: "Couples", href: "/prive/couples", description: "Annonces de couples qui reçoivent chez eux" },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="bg-gray-200 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-black">
              <Home className="h-4 w-4" />
            </Link>
            <span className="mx-2">»</span>
            <span className="text-gray-800">Privé</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Privé</h1>
        <p className="text-gray-600 mb-8">
          Annonces de personnes qui reçoivent chez eux, dans une maison privée ou un club
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.name} className="overflow-hidden">
              <CardContent className="p-6">
                <CardTitle className="text-xl mb-2">{category.name}</CardTitle>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Link href={category.href}>
                  <Button className="w-full bg-red-500 hover:bg-red-600">
                    Voir les annonces
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
