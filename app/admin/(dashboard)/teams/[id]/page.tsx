import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MessageSquareText, Users, Lock } from "lucide-react"
import { PageHeading } from "@/components/page-heading"
import { LiveRefresh } from "@/components/live-refresh"
import { FactorBar } from "@/components/factor-bar"
import { DeleteTeamButton } from "@/components/delete-team-button"
import { EditTeamForm } from "@/components/edit-team-form"
import { getTeam, getTeamScores } from "@/app/actions/data"

export default async function TeamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [team, scores] = await Promise.all([getTeam(id), getTeamScores(id)])
  if (!team) notFound()

  const total = (s: (typeof scores)[number]) =>
    s.problem_identification + s.innovation_creativity + s.presentation_skills
  const avg =
    scores.length > 0 ? Math.round((scores.reduce((a, s) => a + total(s), 0) / scores.length) * 100) / 100 : 0

  return (
    <div className="space-y-5">
      <LiveRefresh />
      <Link
        href="/admin/teams"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Teams
      </Link>

      <PageHeading title={team.team_name} subtitle={team.team_number ? `Team #${team.team_number}` : undefined} />

      {/* Score summary (view only for admin) */}
      <div className="neu rounded-[1.75rem] p-5 animate-rise">
        <p className="text-sm text-muted-foreground">Average Score</p>
        <div className="mt-1 flex items-end gap-2">
          <span className="text-5xl font-extrabold tabular-nums text-primary">{avg}</span>
          <span className="mb-1 text-muted-foreground">/ 30</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{scores.length}/2 judges scored this team</p>
      </div>

      {/* Project details */}
      <div className="neu space-y-3 rounded-[1.75rem] p-5 animate-rise" style={{ animationDelay: "60ms" }}>
        <Detail label="Project Title" value={team.project_title} />
        <Detail label="Category" value={team.category} />
        <Detail label="Problem Statement" value={team.problem_statement} />
        <Detail label="Problem Description" value={team.problem_description} />
        {team.members && (
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Members</p>
            <p className="mt-1 flex items-center gap-2 text-sm">
              <Users className="size-4 text-primary" />
              {team.members}
            </p>
          </div>
        )}
      </div>

      {/* Admin can edit descriptions/details */}
      <EditTeamForm team={team} />

      {/* Per-judge scores */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Judge Scores</h2>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <Lock className="size-3" />
          View only
        </span>
      </div>
      {scores.length === 0 ? (
        <div className="neu rounded-[1.75rem] p-6 text-center text-muted-foreground">Not scored yet.</div>
      ) : (
        <div className="space-y-3">
          {scores.map((s) => (
            <div key={s.id} className="neu rounded-[1.75rem] p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-semibold">{s.judges?.judge_name ?? "Judge"}</p>
                <span className="text-lg font-bold tabular-nums text-primary">{total(s)}/30</span>
              </div>
              <div className="space-y-2">
                <FactorBar label="Problem ID" value={s.problem_identification} tone="problem" />
                <FactorBar label="Innovation" value={s.innovation_creativity} tone="innovation" />
                <FactorBar label="Presentation" value={s.presentation_skills} tone="presentation" />
              </div>
              {s.remark && (
                <div className="neu-inset mt-3 flex gap-2 rounded-2xl p-3 text-sm">
                  <MessageSquareText className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-pretty">{s.remark}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <DeleteTeamButton teamId={team.id} />
      </div>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-pretty text-sm leading-relaxed">{value}</p>
    </div>
  )
}
