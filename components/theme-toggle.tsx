"use client"

import { useEffect, useState } from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-8 h-8 md:w-10 md:h-10 bg-zinc-800 rounded-full">
        <span className="sr-only">Changer de thème</span>
      </Button>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 md:w-10 md:h-10 bg-zinc-800 rounded-full text-white hover:bg-purple-500 transition-colors"
                aria-label="Changer de thème"
              >
                {theme === "light" ? (
                  <Sun className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-200 rotate-0" />
                ) : theme === "dark" ? (
                  <Moon className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-200 rotate-0" />
                ) : (
                  <Monitor className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-200 rotate-0" />
                )}
                <span className="sr-only">Changer de thème</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2 cursor-pointer">
                <Sun className="h-4 w-4" />
                <span>Clair</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2 cursor-pointer">
                <Moon className="h-4 w-4" />
                <span>Sombre</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2 cursor-pointer">
                <Monitor className="h-4 w-4" />
                <span>Système</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>
          <p>Changer de thème</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
