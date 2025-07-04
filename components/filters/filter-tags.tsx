"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface FilterTag {
  id: string
  label: string
  value: string | number | boolean | string[] | number[]
}

interface FilterTagsProps {
  tags: FilterTag[]
  onRemoveTag: (tagId: string) => void
  onClearAll: () => void
}

export function FilterTags({ tags, onRemoveTag, onClearAll }: FilterTagsProps) {
  if (tags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-muted-foreground">Filtres actifs:</span>
      {tags.map((tag) => (
        <Badge key={tag.id} variant="outline" className="flex items-center gap-1 bg-secondary">
          <span>{tag.label}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => onRemoveTag(tag.id)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Supprimer le filtre {tag.label}</span>
          </Button>
        </Badge>
      ))}
      {tags.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
          onClick={onClearAll}
        >
          Effacer tout
        </Button>
      )}
    </div>
  )
}
