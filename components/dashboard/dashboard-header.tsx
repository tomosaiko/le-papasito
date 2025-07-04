"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, User } from "lucide-react"

interface DashboardHeaderProps {
  title?: string
  user?: {
    name: string
    email: string
    avatar?: string
    isVerified: boolean
    subscription?: string
  }
}

export function DashboardHeader({ title, user }: DashboardHeaderProps) {
  const defaultUser = {
    name: "Utilisateur",
    email: "user@example.com",
    isVerified: false,
    subscription: "Gratuit",
    ...user
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{title || defaultUser.name}</h1>
              <p className="text-muted-foreground">{defaultUser.email}</p>
              <div className="flex items-center gap-2 mt-1">
                {defaultUser.isVerified && (
                  <Badge variant="secondary">Vérifié</Badge>
                )}
                <Badge variant="outline">{defaultUser.subscription}</Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 