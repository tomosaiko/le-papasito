import { Loader } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <Loader className="h-12 w-12 text-purple-500 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white">Chargement de votre expérience privilège...</h2>
        <p className="text-gray-400 mt-2">Veuillez patienter un instant</p>
      </div>
    </div>
  )
}
