"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva("rounded-lg border bg-card text-card-foreground shadow-sm transition-all", {
  variants: {
    variant: {
      default: "",
      premium: "border-purple-500",
      gold: "border-yellow-500",
    },
    animation: {
      none: "",
      hover: "hover:shadow-lg hover:-translate-y-1",
      pulse: "hover:animate-pulse",
      glow: "hover:shadow-[0_0_15px_rgba(138,43,226,0.5)]",
    },
  },
  defaultVariants: {
    variant: "default",
    animation: "none",
  },
})

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const AnimatedCard = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, animation, ...props }, ref) => {
  return <div ref={ref} className={cn(cardVariants({ variant, animation, className }))} {...props} />
})
AnimatedCard.displayName = "AnimatedCard"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  ),
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />,
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  ),
)
CardFooter.displayName = "CardFooter"

export { AnimatedCard, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
