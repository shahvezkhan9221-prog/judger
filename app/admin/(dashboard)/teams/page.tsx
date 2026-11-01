import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { PageHeading } from "@/components/page-heading"
import { AddTeamForm } from "@/components/add-team-form"
import { getTeams } from "@/app/actions/data"

export default async function TeamsPage() {
  const teams = await getTeams()

  return (
    <div className="space-y-5">
      <PageHeading title="Teams" subtitle={`${teams.length} registered`} />
      <AddTeamForm />

      <div className="space-y-3">
        {teams.map((t, i) => (
          <Link
            key={t.id}
            href={`/admin/teams/${t.id}`}
            className="neu neu-hover flex items-center gap-3 rounded-[1.5rem] p-4 animate-rise"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{t.team_name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {t.team_number ? `#${t.team_number} · ` : ""}
                {t.project_title ?? "No project title"}
              </p>
            </div>
            {t.category && (
              <span className="neu-inset rounded-full px-3 py-1 text-xs font-medium text-primary">{t.category}</span>
            )}
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  )
}
