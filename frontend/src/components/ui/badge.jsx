import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = {
  default: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
  secondary: "bg-slate-800 text-slate-200 border-slate-700",
  purple: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  emerald: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  destructive: "bg-red-500/20 text-red-300 border-red-500/40",
}

function Badge({ className, variant = "default", ...props }) {
  const variantClass = badgeVariants[variant] || badgeVariants.default
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClass,
        className
      )}
      {...props}
    />
  )
}

export { Badge }
