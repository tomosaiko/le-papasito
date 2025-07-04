import { CheckCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function VerificationSuccess() {
  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-green-100 rounded-full p-6 inline-flex mb-6">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Vérification soumise avec succès !</h2>
      <div className="bg-secondary p-6 rounded-lg mb-6">
        <p className="mb-4">
          Votre demande de vérification a été soumise et est en cours d'examen par notre équipe. Ce processus peut
          prendre jusqu'à 48 heures.
        </p>
        <div className="flex items-center justify-center gap-2 text-purple-600 font-medium mb-4">
          <Shield className="h-5 w-5" />
          <span>Statut: En attente de vérification</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Vous recevrez une notification par email une fois que votre compte aura été vérifié.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Link href="/dashboard">
          <Button className="w-full bg-purple-600 hover:bg-purple-700">Retour au tableau de bord</Button>
        </Link>
        <Link href="/profile">
          <Button variant="outline" className="w-full">
            Voir mon profil
          </Button>
        </Link>
      </div>
    </div>
  )
}
