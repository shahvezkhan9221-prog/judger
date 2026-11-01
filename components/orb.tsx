import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

/**
 * Dreamy pink -> purple gradient orb (brand motif).
 * Optionally renders an icon/label centered on top.
 */
export function Orb({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="orb animate-floaty flex size-full items-center justify-center rounded-full text-primary-foreground">
        {children}
      </div>
    </div>
  )
}
