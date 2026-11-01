"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { ChevronRight, Search } from "lucide-react"
import { searchTeams, type Team } from "@/app/actions/data"
import { Input } from "@/components/ui/input"

export function JudgeSearch({ initial }: { initial: Team[] }) {
  const [query, setQuery] = useState("")
  const [teams, setTeams] = useState<Team[]>(initial)
  const [pending, start] = useTransition()

  useEffect(() => {
    const id = setTimeout(() => {
      start(async () => {
        const res = await searchTeams(query)
        setTeams(res)
      })
    }, 250)
    return () => clearTimeout(id)
  }, [query])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search team name, number, or project"
          className="neu-inset h-12 rounded-2xl border-0 bg-transparent pl-11 shadow-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Search teams"
        />
      </div>

      <div className="space-y-3">
        {teams.length === 0 && (
          <div className="neu rounded-[1.75rem] p-6 text-center text-muted-foreground">
            {pending ? "Searching..." : "No teams found."}
          </div>
        )}
        {teams.map((t, i) => (
          <Link
            key={t.id}
            href={`/judge/team/${t.id}`}
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
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  )
}
