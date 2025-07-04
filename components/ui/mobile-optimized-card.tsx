"use client"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Star, CheckCircle, Shield, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { AnimatedButton } from "./animated-button"

interface MobileOptimizedCardProps {
  id: number
  name: string
  age?: number
  location?: string
  images: string[]
  isGold?: boolean
  isPremium?: boolean
  isVerified?: boolean
  isSafeSex?: boolean
  imageCount?: string
  className?: string
  onClick?: () => void
  showBookingButton?: boolean
}

export function MobileOptimizedCard({
  id,
  name,
  age,
  location,
  images,
  isGold,
  isPremium,
  isVerified,
  isSafeSex,
  imageCount,
  className,
  onClick,
  showBookingButton = false,
}: MobileOptimizedCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow",
        isGold && "border-yellow-500 dark:border-yellow-600",
        isPremium && "border-purple-500 dark:border-purple-600",
        className,
      )}
      onClick={onClick}
    >
      <div className="relative">
        {isGold && (
          <Badge variant="gold" className="absolute top-1 left-1 z-10 flex items-center scale-75 md:scale-100">
            <Star className="h-3 w-3 mr-0.5 fill-current" />
            <span className="text-[10px] md:text-xs">GOLD</span>
          </Badge>
        )}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={images[0] || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
            priority={isGold || isPremium}
            loading={isGold || isPremium ? "eager" : "lazy"}
          />
          {imageCount && (
            <div className="absolute inset-x-0 bottom-0 flex justify-between items-center px-1 py-0.5 md:px-2 md:py-1">
              <button className="bg-black/30 rounded-full p-0.5 md:p-1 text-white">
                <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
              </button>
              <span className="text-white text-[10px] md:text-xs font-medium bg-black/50 px-1 py-0.5 rounded">
                {imageCount}
              </span>
              <button className="bg-black/30 rounded-full p-0.5 md:p-1 text-white">
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="p-1.5 md:p-3">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-black dark:text-white text-xs md:text-sm truncate max-w-[70%]">{name}</h3>
          {age && <span className="text-xs text-black dark:text-white">{age}a</span>}
        </div>
        {location && <p className="text-xs md:text-sm text-black dark:text-white truncate">{location}</p>}
        <div className="flex items-center gap-1 md:gap-2 mt-1 md:mt-2 flex-wrap">
          {isVerified && (
            <div className="flex items-center text-black dark:text-white text-[10px] md:text-xs">
              <CheckCircle className="h-2 w-2 md:h-3 md:w-3 mr-0.5 md:mr-1 text-green-600" />
              <span className="hidden xs:inline">Vérifié</span>
            </div>
          )}
          {isSafeSex && (
            <div className="flex items-center text-black dark:text-white text-[10px] md:text-xs">
              <Shield className="h-2 w-2 md:h-3 md:w-3 mr-0.5 md:mr-1 text-blue-600" />
              <span className="hidden xs:inline">Safe</span>
            </div>
          )}
        </div>

        {showBookingButton && (
          <div className="mt-2">
            <Link href={`/booking/${id}`} passHref>
              <AnimatedButton variant="purple" size="sm" className="w-full text-xs font-semibold">
                <Calendar className="mr-1 h-3 w-3" /> Réserver
              </AnimatedButton>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
