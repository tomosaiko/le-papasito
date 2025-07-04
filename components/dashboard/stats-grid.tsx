"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsGridProps {
  views: number
  viewsChange: number
  likes: number
  likesChange: number
  subscription: string
  nextBilling: string
  referrals: number
  referralEarnings: string
  className?: string
  compact?: boolean
}

export function StatsGrid({ 
  views, 
  viewsChange, 
  likes, 
  likesChange, 
  subscription, 
  nextBilling, 
  referrals, 
  referralEarnings, 
  className,
  compact = false
}: StatsGridProps) {
  const StatCard = ({ 
    title, 
    value, 
    change, 
    subtitle,
    format = (val: number | string) => val.toString() 
  }: {
    title: string
    value: number | string
    change?: number
    subtitle?: string
    format?: (val: number | string) => string
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {change !== undefined && (
          <div className={`flex items-center text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {Math.abs(change)}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{format(value)}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  )

  const gridCols = compact ? "grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

  return (
    <div className={cn(`grid gap-4 ${gridCols}`, className)}>
      <StatCard
        title="Vues du profil"
        value={views}
        change={viewsChange}
        subtitle="Total des vues"
      />
      <StatCard
        title="Likes"
        value={likes}
        change={likesChange}
        subtitle="Total des likes"
      />
      <StatCard
        title="Abonnement"
        value={subscription}
        subtitle={`Prochain: ${nextBilling}`}
        format={(val) => val.toString().charAt(0).toUpperCase() + val.toString().slice(1)}
      />
      <StatCard
        title="Parrainages"
        value={referrals}
        subtitle={`Gains: ${referralEarnings}`}
      />
    </div>
  )
} 