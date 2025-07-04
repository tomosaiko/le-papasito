"use client"

import { useState } from "react"
import { VerificationSteps } from "@/components/verification/verification-steps"
import { VerificationSuccess } from "@/components/verification/verification-success"

export default function VerificationPage() {
  const [isVerificationComplete, setIsVerificationComplete] = useState(false)

  const handleVerificationComplete = () => {
    setIsVerificationComplete(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {isVerificationComplete ? <VerificationSuccess /> : <VerificationSteps onComplete={handleVerificationComplete} />}
    </div>
  )
}
