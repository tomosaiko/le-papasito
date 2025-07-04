"use client"

import { type ButtonHTMLAttributes, forwardRef } from "react"
import { type VariantProps, cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        gold: "bg-gold text-black hover:bg-gold-light",
        purple: "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg",
        red: "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg",
        glow: "bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)] transition-all duration-300",
        pulse: "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg animate-pulse",
        bounce: "bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg hover:animate-bounce",
        reservation:
          "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white text-lg font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transform hover:scale-105 transition-all duration-300 py-3 px-6 rounded-xl",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface AnimatedButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  animation?: "pulse" | "glow" | "bounce" | "none"
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant, size, asChild = false, animation, ...props }, ref) => {
    return (
      <Button
        className={cn(
          buttonVariants({ variant, size, className }),
          variant === "reservation" && "animate-pulse-subtle",
          animation === "pulse" && "animate-pulse",
          animation === "glow" && "shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_rgba(147,51,234,0.7)]",
          animation === "bounce" && "hover:animate-bounce",
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
AnimatedButton.displayName = "AnimatedButton"

export const animationStyles = {
  "pulse-subtle": "animate-[pulse_3s_ease-in-out_infinite]",
}

export { AnimatedButton, buttonVariants }
