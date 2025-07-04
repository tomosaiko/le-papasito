import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        gold: "border-transparent bg-yellow-500 text-black hover:bg-yellow-600",
        premium: "border-transparent bg-purple-500 text-white hover:bg-purple-600",
        verified: "border-transparent bg-green-500 text-white hover:bg-green-600",
        safesex: "border-transparent bg-blue-500 text-white hover:bg-blue-600",
        purple: "border-transparent bg-purple-500 text-white hover:bg-purple-600",
      },
      animation: {
        none: "",
        pulse: "animate-pulse",
        glow: "shadow-[0_0_10px_rgba(138,43,226,0.5)]",
      },
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, animation, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, animation }), className)} {...props} />
}

export { Badge, badgeVariants }
