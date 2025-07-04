import type { Metadata } from "next"
import { SearchForm } from "@/components/search/search-form"

export const metadata: Metadata = {
  title: "Recherche de disponibilité | HEY PAPASITO",
  description: "Trouvez les hôtesses disponibles selon vos critères de recherche.",
}

export default function DisponibilitePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Recherche de disponibilité</h1>
          <p className="text-lg text-gray-600">Trouvez les hôtesses disponibles selon vos critères de recherche.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <SearchForm />
        </div>
      </div>
    </div>
  )
}
