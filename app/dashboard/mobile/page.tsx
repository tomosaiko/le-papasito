"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { StatsButtonsGrid } from "@/components/dashboard/stats-buttons-grid"
import { Button } from "@/components/ui/button"
import { User, ImageIcon, CreditCard, Users, Settings, Bell, LogOut } from "lucide-react"

export default function MobileDashboard() {
  const { dictionary } = useLanguage()

  // Sample data
  const userData = {
    name: "Sophia",
    stats: {
      views: 1245,
      likes: 87,
      viewsThisWeek: 245,
      likesThisWeek: 18,
      subscription: "Premium",
      referrals: 3,
      earnings: "€30.00",
    },
  }

  return (
    <div className="container px-4 py-6 bg-black min-h-screen text-white">
      <h1 className="text-xl font-bold mb-2">Bonjour, {userData.name}</h1>
      <p className="text-sm text-gray-400 mb-6">Voici un aperçu de votre compte</p>

      {/* Stats Buttons Grid (2x2) */}
      <StatsButtonsGrid
        views={userData.stats.views}
        viewsChange={userData.stats.viewsThisWeek}
        likes={userData.stats.likes}
        likesChange={userData.stats.likesThisWeek}
        subscription={userData.stats.subscription}
        referrals={userData.stats.referrals}
        earnings={userData.stats.earnings}
        className="mb-6"
      />

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold mb-3 mt-6">Actions rapides</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button
          variant="outline"
          className="flex items-center justify-start h-12 bg-[#222222] border-0 text-white hover:bg-[#333333]"
        >
          <User className="h-4 w-4 mr-2" />
          Profil
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-start h-12 bg-[#222222] border-0 text-white hover:bg-[#333333]"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Galerie
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-start h-12 bg-[#222222] border-0 text-white hover:bg-[#333333]"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Abonnement
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-start h-12 bg-[#222222] border-0 text-white hover:bg-[#333333]"
        >
          <Users className="h-4 w-4 mr-2" />
          Parrainage
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-start h-12 bg-[#222222] border-0 text-white hover:bg-[#333333]"
        >
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-start h-12 bg-[#222222] border-0 text-white hover:bg-[#333333]"
        >
          <Settings className="h-4 w-4 mr-2" />
          Paramètres
        </Button>
      </div>

      <Button variant="ghost" className="w-full flex items-center justify-center text-red-500 mt-6">
        <LogOut className="h-4 w-4 mr-2" />
        Se déconnecter
      </Button>
    </div>
  )
} 