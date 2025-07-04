import type { Metadata } from "next"
import { SearchResults } from "@/components/search/search-results"

export const metadata: Metadata = {
  title: "Résultats de recherche | HEY PAPASITO",
  description: "Résultats de votre recherche d'hôtesses disponibles.",
}

export default async function SearchResultsPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ 
    time?: string; 
    location?: string; 
    radius?: string;
    date?: string;
  }> 
}) {
  const params = await searchParams
  const time = params.time || ""
  const location = params.location || ""
  const radius = Number.parseInt(params.radius || "10")
  const date = params.date || ""

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchResults time={time} location={location} radius={radius} date={date} />
    </div>
  )
}
