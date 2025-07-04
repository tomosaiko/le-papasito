"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Filter } from "lucide-react"

export default function PriveFetiche() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Breadcrumb */}
      <div className="bg-gray-200 py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-gray-600 hover:text-black">
              <Home className="h-4 w-4" />
            </Link>
            <span className="mx-2">»</span>
            <Link href="/prive" className="text-gray-600 hover:text-black">
              Privé
            </Link>
            <span className="mx-2">»</span>
            <span className="text-gray-800">Fétiche</span>
          </div>
          <Button variant="outline" className="flex items-center gap-2 bg-white">
            <Filter className="h-4 w-4" />
            Filtrer les annonces
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">Privé fétiche</h1>
        <p className="text-gray-600 mb-6">Annonces de services fétichistes dans un cadre privé</p>

        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Aucune annonce disponible pour le moment</p>
        </div>
      </div>
    </div>
  )
}
