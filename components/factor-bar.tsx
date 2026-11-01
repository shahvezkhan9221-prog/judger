import { cn } from "@/lib/utils"

const TONES = {
  problem: "bg-chart-1",
  innovation: "bg-chart-2",
  presentation: "bg-chart-3",
} as const

export function FactorBar({
  label,
  value,
  max = 10,
  tone,
}: {
  label: string
  value: number
  max?: number
  tone: keyof typeof TONES
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">
          {value}
          <span className="text-muted-foreground">/{max}</span>
        </span>
      </div>
      <div className="neu-inset h-2.5 overflow-hidden rounded-full">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", TONES[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
