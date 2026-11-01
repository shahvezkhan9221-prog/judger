import { PageHeading } from "@/components/page-heading"
import { JudgeSearch } from "@/components/judge-search"
import { searchTeams } from "@/app/actions/data"

export default async function JudgeHome() {
  const initial = await searchTeams("")
  return (
    <div className="space-y-5">
      <PageHeading title="Find a Team" subtitle="Search, review the problem, and submit your scores" />
      <JudgeSearch initial={initial} />
    </div>
  )
}
