import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  default: "bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm",
  destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
  outline: "border border-slate-800 bg-slate-900/60 text-slate-100 hover:bg-slate-800 hover:text-white hover:border-cyan-500",
  secondary: "bg-purple-600 text-white hover:bg-purple-700 shadow-sm",
  emerald: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
  ghost: "hover:bg-slate-800 hover:text-white",
  link: "text-white underline-offset-4 hover:underline font-bold",
}

const buttonSizes = {
  default: "h-10 px-4 py-2 text-sm rounded-lg",
  sm: "h-8 px-3 text-xs rounded-md",
  lg: "h-12 px-6 text-base rounded-xl",
  icon: "h-9 w-9 p-0 rounded-lg flex items-center justify-center",
}

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variantClass = buttonVariants[variant] || buttonVariants.default
  const sizeClass = buttonSizes[size] || buttonSizes.default

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        variantClass,
        sizeClass,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
