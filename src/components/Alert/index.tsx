import React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../utils/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg]:size-4 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: 
          "bg-light-blue/20 text-dark-blue border-sky-blue/30 [&>svg]:text-sky-blue",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/20 [&>svg]:text-destructive",
        warning:
          "bg-sunshine-yellow/20 text-dark-blue border-sunshine-yellow/40 [&>svg]:text-sunshine-yellow",
        success:
          "bg-green-50 text-green-800 border-green-200 [&>svg]:text-green-600",
        info:
          "bg-light-yellow/30 text-dark-blue border-light-yellow/50 [&>svg]:text-dark-blue"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), "flex items-start gap-3", className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn(
      "mb-1 font-medium leading-none tracking-tight",
      "font-heading text-dark-blue",
      className
    )}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-sm opacity-90 [&_p]:leading-relaxed",
      "font-body text-dark-blue",
      className
    )}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }