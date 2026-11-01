import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30"
        aria-hidden
      >
        <span className="text-sm font-extrabold tracking-tight">SIH</span>
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold tracking-tight">SIH Judge</p>
        <p className="text-[11px] text-muted-foreground">GLA University · Internal</p>
      </div>
    </div>
  )
}
