import type { VerificationStep } from "@/types"

export const verificationSteps: VerificationStep[] = [
  {
    id: 1,
    title: "Vérification de l'email",
    description: "Confirmez votre adresse email en cliquant sur le lien envoyé à votre boîte de réception.",
    completed: true,
    required: true
  },
  {
    id: 2,
    title: "Vérification du téléphone",
    description: "Confirmez votre numéro de téléphone en saisissant le code reçu par SMS.",
    completed: false,
    required: true
  },
  {
    id: 3,
    title: "Vérification d'identité",
    description: "Téléchargez une pièce d'identité valide pour vérifier votre identité.",
    completed: false,
    required: true
  },
  {
    id: 4,
    title: "Vérification du profil",
    description: "Complétez votre profil avec des informations détaillées et des photos.",
    completed: false,
    required: false
  }
]
