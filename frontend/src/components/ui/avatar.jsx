import * as React from "react"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ className, src, alt, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-cyan-500/60 shadow-md", className)}
    {...props}
  >
    <img src={src} alt={alt || "Avatar"} className="aspect-square h-full w-full object-cover" />
  </div>
))
Avatar.displayName = "Avatar"

export { Avatar }
