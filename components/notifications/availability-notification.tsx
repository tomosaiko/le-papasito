"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, CheckCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AvailabilityNotificationProps {
  hostessId: number
  hostessName: string
  availableTimes: string[]
  onAccept: () => void
  onDecline: () => void
}

export function AvailabilityNotification({
  hostessId,
  hostessName,
  availableTimes,
  onAccept,
  onDecline
}: AvailabilityNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default")

  useEffect(() => {
    // Vérifier les permissions de notification
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      
      if (permission === "granted") {
        // Envoyer une notification de test
        new Notification("HEY PAPASITO", {
          body: "Vous recevrez maintenant des notifications pour les nouvelles disponibilités !",
          icon: "/images/logo.png"
        })
      }
    }
  }

  const sendNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/images/logo.png",
        badge: "/images/logo.png",
        tag: `availability-${hostessId}`,
        requireInteraction: true,
        actions: [
          {
            action: "accept",
            title: "Réserver"
          },
          {
            action: "decline", 
            title: "Plus tard"
          }
        ]
      })
    }
  }

  useEffect(() => {
    // Envoyer une notification push pour cette disponibilité
    sendNotification(
      `${hostessName} est disponible !`,
      `Nouveaux créneaux : ${availableTimes.slice(0, 3).join(", ")}...`
    )
  }, [hostessId, hostessName, availableTimes])

  const handleAccept = () => {
    setIsVisible(false)
    onAccept()
  }

  const handleDecline = () => {
    setIsVisible(false)
    onDecline()
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed top-4 right-4 z-50 max-w-sm w-full"
      >
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-gray-900">Nouvelle disponibilité</span>
            </div>
            <button
              onClick={handleDecline}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-3">
            <h4 className="font-medium text-gray-900 mb-1">{hostessName}</h4>
            <p className="text-sm text-gray-600 mb-2">
              Nouveaux créneaux disponibles :
            </p>
            <div className="flex flex-wrap gap-1">
              {availableTimes.slice(0, 4).map((time, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full"
                >
                  {time}
                </span>
              ))}
              {availableTimes.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{availableTimes.length - 4} autres
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleAccept}
              size="sm"
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Réserver
            </Button>
            <Button
              onClick={handleDecline}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              Plus tard
            </Button>
          </div>

          {notificationPermission !== "granted" && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Bell className="h-3 w-3" />
                <span>Activer les notifications pour ne rien manquer</span>
              </div>
              <Button
                onClick={requestNotificationPermission}
                variant="ghost"
                size="sm"
                className="mt-1 text-xs text-purple-600 hover:text-purple-700"
              >
                Activer
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook pour gérer les notifications de disponibilité
export function useAvailabilityNotifications() {
  const [notifications, setNotifications] = useState<any[]>([])

  const addNotification = (notification: any) => {
    setNotifications(prev => [...prev, { ...notification, id: Date.now() }])
  }

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  }
} 