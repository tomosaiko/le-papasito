"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Heart, CreditCard, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsButtonsGridProps {
  views: number
  viewsChange: number
  likes: number
  likesChange: number
  subscription: string
  referrals: number
  earnings: string
  className?: string
}

export function StatsButtonsGrid({ 
  views, 
  viewsChange, 
  likes, 
  likesChange, 
  subscription, 
  referrals, 
  earnings, 
  className 
}: StatsButtonsGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <Card className="bg-[#222222] border-0">
        <CardContent className="p-4">
          <Button variant="ghost" className="w-full h-auto p-0 flex flex-col items-center gap-2 text-white hover:bg-[#333333]">
            <Eye className="h-6 w-6 text-blue-400" />
            <div className="text-center">
              <div className="text-2xl font-bold">{views}</div>
              <div className="text-sm text-gray-400">Vues</div>
              <div className="text-xs text-green-400">+{viewsChange} cette semaine</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#222222] border-0">
        <CardContent className="p-4">
          <Button variant="ghost" className="w-full h-auto p-0 flex flex-col items-center gap-2 text-white hover:bg-[#333333]">
            <Heart className="h-6 w-6 text-red-400" />
            <div className="text-center">
              <div className="text-2xl font-bold">{likes}</div>
              <div className="text-sm text-gray-400">Likes</div>
              <div className="text-xs text-green-400">+{likesChange} cette semaine</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#222222] border-0">
        <CardContent className="p-4">
          <Button variant="ghost" className="w-full h-auto p-0 flex flex-col items-center gap-2 text-white hover:bg-[#333333]">
            <CreditCard className="h-6 w-6 text-amber-400" />
            <div className="text-center">
              <div className="text-lg font-bold">{subscription}</div>
              <div className="text-sm text-gray-400">Abonnement</div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-[#222222] border-0">
        <CardContent className="p-4">
          <Button variant="ghost" className="w-full h-auto p-0 flex flex-col items-center gap-2 text-white hover:bg-[#333333]">
            <Users className="h-6 w-6 text-purple-400" />
            <div className="text-center">
              <div className="text-2xl font-bold">{referrals}</div>
              <div className="text-sm text-gray-400">Parrainages</div>
              <div className="text-xs text-green-400">{earnings}</div>
            </div>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 