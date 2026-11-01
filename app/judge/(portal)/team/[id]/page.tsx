import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Users } from "lucide-react"
import { PageHeading } from "@/components/page-heading"
import { ScoreForm } from "@/components/score-form"
import { getTeam, getMyScore, isTeamLockedForMe } from "@/app/actions/data"

export default async function JudgeTeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [team, existing, locked] = await Promise.all([
    getTeam(id),
    getMyScore(id),
    isTeamLockedForMe(id),
  ])
  if (!team) notFound()

  return (
    <div className="space-y-5">
      <Link href="/judge" className="inline-flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowLeft className="size-4" />
        Search
      </Link>

      <PageHeading title={team.team_name} />

      <div className="neu rounded-[1.75rem] p-5 animate-rise">
        <div className="flex items-start gap-3">
          <Users className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Team members</p>
            <p className="text-pretty text-sm">{team.members || "No members listed"}</p>
          </div>
        </div>
      </div>

      <PageHeading title="Your Scores" subtitle="Rate each factor from 0 to 10" />
      <ScoreForm teamId={team.id} existing={existing} locked={locked} />
    </div>
  )
}
