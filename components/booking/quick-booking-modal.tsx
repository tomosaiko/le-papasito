"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, MapPin, CreditCard, User, Calendar as CalendarIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format, addHours, isAfter, isBefore, startOfToday } from "date-fns"
import { fr } from "date-fns/locale"

interface QuickBookingModalProps {
  isOpen: boolean
  onClose: () => void
  hostess: {
    id: number
    name: string
    price: string
    location: string
    image: string
    availableTimes: string[]
    services: string[]
  }
}

type BookingStep = "time" | "details" | "payment" | "confirmation"

export function QuickBookingModal({ isOpen, onClose, hostess }: QuickBookingModalProps) {
  const [currentStep, setCurrentStep] = useState<BookingStep>("time")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedService, setSelectedService] = useState<string>("")
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    email: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)

  // Générer les créneaux intelligents
  const getIntelligentTimeSlots = () => {
    if (!selectedDate) return hostess.availableTimes.slice(0, 6)

    const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
    const currentHour = new Date().getHours()
    const currentMinute = new Date().getMinutes()

    if (isToday) {
      return hostess.availableTimes.filter(time => {
        const [hour, minute] = time.split(":").map(Number)
        return hour > currentHour || (hour === currentHour && minute > currentMinute + 30)
      }).slice(0, 6)
    }

    return hostess.availableTimes.slice(0, 6)
  }

  const intelligentTimeSlots = getIntelligentTimeSlots()

  // Validation des étapes
  const canProceedToDetails = selectedDate && selectedTime && selectedService
  const canProceedToPayment = userDetails.name && userDetails.phone && userDetails.email

  const handleNextStep = () => {
    if (currentStep === "time" && canProceedToDetails) {
      setCurrentStep("details")
    } else if (currentStep === "details" && canProceedToPayment) {
      setCurrentStep("payment")
    } else if (currentStep === "payment") {
      handleBooking()
    }
  }

  const handlePreviousStep = () => {
    if (currentStep === "details") {
      setCurrentStep("time")
    } else if (currentStep === "payment") {
      setCurrentStep("details")
    }
  }

  const handleBooking = async () => {
    setIsProcessing(true)
    
    // Simuler le processus de booking
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setCurrentStep("confirmation")
    setIsProcessing(false)
  }

  const handleClose = () => {
    if (currentStep !== "confirmation") {
      setCurrentStep("time")
      setSelectedDate(undefined)
      setSelectedTime("")
      setSelectedService("")
      setUserDetails({ name: "", phone: "", email: "" })
    }
    onClose()
  }

  const getStepIcon = (step: BookingStep) => {
    switch (step) {
      case "time": return <Clock className="h-5 w-5" />
      case "details": return <User className="h-5 w-5" />
      case "payment": return <CreditCard className="h-5 w-5" />
      case "confirmation": return <CheckCircle className="h-5 w-5" />
    }
  }

  const getStepTitle = (step: BookingStep) => {
    switch (step) {
      case "time": return "Choisir date et heure"
      case "details": return "Vos informations"
      case "payment": return "Paiement sécurisé"
      case "confirmation": return "Réservation confirmée"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStepIcon(currentStep)}
            {getStepTitle(currentStep)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {(["time", "details", "payment"] as BookingStep[]).map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? "bg-purple-600 text-white" 
                    : index < ["time", "details", "payment"].indexOf(currentStep)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index < ["time", "details", "payment"].indexOf(currentStep)
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === "time" && (
                <div className="space-y-4">
                  <div>
                    <Label>Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => isBefore(date, startOfToday())}
                      className="rounded-md border"
                    />
                  </div>

                  <div>
                    <Label>Heure</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {intelligentTimeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? "default" : "outline"}
                          onClick={() => setSelectedTime(time)}
                          className="text-sm"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Service</Label>
                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un service" />
                      </SelectTrigger>
                      <SelectContent>
                        {hostess.services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === "details" && (
                <div className="space-y-4">
                  <div>
                    <Label>Nom complet</Label>
                    <Input
                      value={userDetails.name}
                      onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Votre nom"
                    />
                  </div>

                  <div>
                    <Label>Téléphone</Label>
                    <Input
                      value={userDetails.phone}
                      onChange={(e) => setUserDetails(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+32 123 456 789"
                      type="tel"
                    />
                  </div>

                  <div>
                    <Label>Email</Label>
                    <Input
                      value={userDetails.email}
                      onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="votre@email.com"
                      type="email"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Récapitulatif</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Hôtesse :</strong> {hostess.name}</p>
                      <p><strong>Date :</strong> {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: fr })}</p>
                      <p><strong>Heure :</strong> {selectedTime}</p>
                      <p><strong>Service :</strong> {selectedService}</p>
                      <p><strong>Prix :</strong> {hostess.price}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "payment" && (
                <div className="space-y-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Paiement sécurisé</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Votre réservation sera confirmée après le paiement
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{hostess.price}</span>
                      <Button
                        onClick={handleBooking}
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Traitement...
                          </>
                        ) : (
                          "Payer et confirmer"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "confirmation" && (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Réservation confirmée !</h3>
                    <p className="text-gray-600">
                      Votre rendez-vous avec {hostess.name} a été confirmé.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-left">
                    <h4 className="font-medium mb-2">Détails du rendez-vous</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Date :</strong> {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: fr })}</p>
                      <p><strong>Heure :</strong> {selectedTime}</p>
                      <p><strong>Lieu :</strong> {hostess.location}</p>
                      <p><strong>Service :</strong> {selectedService}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons */}
          {currentStep !== "confirmation" && (
            <div className="flex gap-2">
              {currentStep !== "time" && (
                <Button
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="flex-1"
                >
                  Retour
                </Button>
              )}
              <Button
                onClick={handleNextStep}
                disabled={
                  (currentStep === "time" && !canProceedToDetails) ||
                  (currentStep === "details" && !canProceedToPayment) ||
                  (currentStep === "payment" && isProcessing)
                }
                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                {currentStep === "payment" ? "Confirmer" : "Continuer"}
              </Button>
            </div>
          )}

          {currentStep === "confirmation" && (
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
            >
              Fermer
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 