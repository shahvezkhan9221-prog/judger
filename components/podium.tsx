import Link from "next/link"
import { Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LeaderboardRow } from "@/app/actions/data"

type Slot = { row: LeaderboardRow; rank: 1 | 2 | 3 }

const RANK: Record<
  1 | 2 | 3,
  { ring: string; pedestal: string; num: string; height: string; delay: string }
> = {
  1: {
    ring: "ring-[3px] ring-gold",
    pedestal: "bg-gradient-to-b from-gold to-[oklch(0.78_0.14_78)] text-gold-foreground",
    num: "text-gold-foreground/40",
    height: "h-28",
    delay: "80ms",
  },
  2: {
    ring: "ring-2 ring-primary/50",
    pedestal: "bg-gradient-to-b from-primary to-[oklch(0.5_0.2_295)] text-primary-foreground",
    num: "text-primary-foreground/40",
    height: "h-20",
    delay: "0ms",
  },
  3: {
    ring: "ring-2 ring-mint/70",
    pedestal: "bg-gradient-to-b from-mint to-[oklch(0.7_0.13_180)] text-mint-foreground",
    num: "text-mint-foreground/40",
    height: "h-16",
    delay: "160ms",
  },
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

function Column({ slot }: { slot: Slot }) {
  const { row, rank } = slot
  const s = RANK[rank]
  return (
    <Link
      href={`/admin/teams/${row.id}`}
      className="flex flex-1 flex-col items-center gap-2 animate-rise"
      style={{ animationDelay: s.delay }}
    >
      <div className="relative mt-1">
        {rank === 1 && (
          <Crown className="absolute -top-5 left-1/2 size-6 -translate-x-1/2 text-gold drop-shadow" aria-hidden />
        )}
        <div
          className={cn(
            "neu flex size-14 items-center justify-center rounded-full text-base font-extrabold text-primary",
            s.ring,
          )}
        >
          {initials(row.team_name)}
        </div>
      </div>

      <div className="text-center">
        <p className="max-w-[6.5rem] truncate text-xs font-bold leading-tight">{row.team_name}</p>
        <p className="text-lg font-extrabold leading-tight tabular-nums text-primary">
          {row.avg_total}
          <span className="text-[10px] font-semibold text-muted-foreground"> /30</span>
        </p>
      </div>

      <div
        className={cn(
          "relative flex w-full items-start justify-center overflow-hidden rounded-t-2xl pt-2 shadow-[0_10px_24px_-14px_oklch(0.5_0.2_300/0.6)]",
          s.pedestal,
          s.height,
        )}
      >
        <span className={cn("text-3xl font-black leading-none", s.num)}>{rank}</span>
      </div>
    </Link>
  )
}

export function Podium({ rows }: { rows: LeaderboardRow[] }) {
  const scored = rows.filter((r) => r.judges_count > 0).slice(0, 3)
  if (scored.length === 0) return null

  const [first, second, third] = scored
  const order: Slot[] = []
  if (second) order.push({ row: second, rank: 2 })
  if (first) order.push({ row: first, rank: 1 })
  if (third) order.push({ row: third, rank: 3 })

  return (
    <div className="flex items-end justify-center gap-2.5 px-1 pt-6">
      {order.map((slot) => (
        <Column key={slot.row.id} slot={slot} />
      ))}
    </div>
  )
}
