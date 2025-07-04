"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface QuickFilter {
  id: string
  label: string
  icon?: React.ReactNode
  emoji?: string
}

interface QuickFiltersProps {
  filters: QuickFilter[]
  activeFilters: string[]
  onFilterToggle: (filterId: string) => void
}

export function QuickFilters({ filters, activeFilters, onFilterToggle }: QuickFiltersProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap pb-4">
      <div className="flex space-x-2 p-1">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilters.includes(filter.id) ? "default" : "outline"}
            className={`flex items-center gap-2 rounded-full ${
              activeFilters.includes(filter.id) ? "bg-purple-600 hover:bg-purple-700" : ""
            }`}
            onClick={() => onFilterToggle(filter.id)}
          >
            {filter.icon}
            {filter.emoji && <span className="text-lg">{filter.emoji}</span>}
            <span>{filter.label}</span>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
