"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Home } from "lucide-react"

export default function InscriptionType() {
  const [userType, setUserType] = useState<string | undefined>(undefined)
  const router = useRouter()

  const handleNext = () => {
    if (!userType) return

    // Redirect to the appropriate next step based on user type
    router.push(`/inscription/${userType}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              <Home className="h-5 w-5" />
            </Link>
            <span className="mx-2">»</span>
            <Link href="/inscription" className="hover:text-foreground transition-colors">
              Inscription
            </Link>
            <span className="mx-2">»</span>
            <span>Type de compte</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-12">Inscription</h1>

        <div className="space-y-8">
          <RadioGroup value={userType} onValueChange={setUserType}>
            <div className="space-y-8">
              {/* Option 1 */}
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="escort" id="escort" className="mt-1" />
                <div className="space-y-2">
                  <Label htmlFor="escort" className="text-xl font-semibold">
                    Privé, massage ou escort
                  </Label>
                  <p className="text-muted-foreground">
                    Vous êtes une femme, homme ou une transsexuelle indépendante qui reçoit en privé ou offre des
                    services d&apos;escorte.
                  </p>
                </div>
              </div>

              {/* Option 2 */}
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="agency" id="agency" className="mt-1" />
                <div className="space-y-2">
                  <Label htmlFor="agency" className="text-xl font-semibold">
                    Maison privée, salon de massage ou agence d&apos;escorte
                  </Label>
                  <p className="text-muted-foreground">
                    Vous êtes le propriétaire d&apos;une maison privée ou agence d&apos;escorte et vous avez plusieurs
                    employés
                  </p>
                </div>
              </div>

              {/* Option 3 */}
              <div className="flex items-start space-x-3">
                <RadioGroupItem value="visitor" id="visitor" className="mt-1" />
                <div className="space-y-2">
                  <Label htmlFor="visitor" className="text-xl font-semibold">
                    Libertin ou visiteur
                  </Label>
                  <p className="text-muted-foreground">
                    Vous êtes un échangiste, libertin ou visiteur et vous souhaitez gérer vos favoris, envoyer des
                    messages ou placer une annonce non-commerciale
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>

          <div className="pt-8">
            <Button
              onClick={handleNext}
              disabled={!userType}
              className="bg-[#e05d44] hover:bg-[#c94d37] text-white px-12 py-6 text-lg font-medium"
              style={{ backgroundColor: "#e05d44" }}
            >
              SUIVANT
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
