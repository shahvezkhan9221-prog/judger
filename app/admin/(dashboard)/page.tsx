import Link from "next/link"
import { ChevronRight, Trophy, Users } from "lucide-react"
import { PageHeading } from "@/components/page-heading"
import { LiveRefresh } from "@/components/live-refresh"
import { FactorBar } from "@/components/factor-bar"
import { Podium } from "@/components/podium"
import { getLeaderboard } from "@/app/actions/data"

export default async function AdminDashboard() {
  const rows = await getLeaderboard()
  const scored = rows.filter((r) => r.judges_count > 0)
  const podiumCount = Math.min(3, scored.length)
  const rest = rows.slice(podiumCount)

  return (
    <div className="space-y-6">
      <LiveRefresh />
      <PageHeading title="Live Leaderboard" subtitle="Ranked by average judge score · out of 30" />

      {scored.length === 0 ? (
        <div className="neu rounded-[1.75rem] p-8 text-center text-muted-foreground">
          <Trophy className="mx-auto mb-2 size-7 opacity-60" />
          <p className="font-medium">No scores yet</p>
          <p className="mt-1 text-sm">The podium appears once judges start scoring.</p>
        </div>
      ) : (
        <section className="neu rounded-[2rem] p-4 pb-5">
          <Podium rows={rows} />
        </section>
      )}

      {/* Ranked remainder */}
      {rest.length > 0 && (
        <div className="space-y-3">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {podiumCount >= 3 ? "Rest of the field" : "All teams"}
          </h2>
          {rest.map((r, i) => (
            <Link
              key={r.id}
              href={`/admin/teams/${r.id}`}
              className="neu neu-hover block rounded-[1.5rem] p-4 animate-rise"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className="neu-inset flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-primary tabular-nums">
                  {podiumCount + i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{r.team_name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.team_number ? `#${r.team_number} · ` : ""}
                    {r.judges_count}/2 judges
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold tabular-nums">{r.avg_total}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">avg / 30</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>

              {r.judges_count > 0 && (
                <div className="mt-3 space-y-2">
                  <FactorBar label="Problem ID" value={r.avg_problem} tone="problem" />
                  <FactorBar label="Innovation" value={r.avg_innovation} tone="innovation" />
                  <FactorBar label="Presentation" value={r.avg_presentation} tone="presentation" />
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {rows.length === 0 && (
        <div className="neu rounded-[1.75rem] p-6 text-center text-muted-foreground">
          <Users className="mx-auto mb-2 size-6 opacity-60" />
          No teams yet. Add teams to get started.
        </div>
      )}
    </div>
  )
}
