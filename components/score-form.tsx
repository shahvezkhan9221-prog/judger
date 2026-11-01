"use client"

import { useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { submitScore, type ScoreRow } from "@/app/actions/data"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

const FACTORS = [
  { name: "problem_identification", label: "Problem Understanding", max: 15 },
  { name: "innovation_creativity", label: "Innovation & Creativity", max: 15 },
  { name: "presentation_skills", label: "Technical Feasibility", max: 15 },
  { name: "implementation_strategy", label: "Implementation Strategy", max: 15 },
  { name: "potential_impact_relevance", label: "Potential Impact & Relevance", max: 15 },
  { name: "scalability_sustainability", label: "Scalability & Sustainability", max: 15 },
  { name: "presentation_clarity", label: "Presentation Clarity", max: 10 },
] as const

export function ScoreForm({
  teamId,
  existing,
  locked,
}: {
  teamId: string
  existing: ScoreRow | null
  locked: boolean
}) {
  const router = useRouter()
  const [state, action, pending] = useActionState(submitScore, undefined)

  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(FACTORS.map((factor) => [factor.name, existing?.[factor.name as keyof ScoreRow] as number ?? Math.ceil(factor.max / 2)])),
  )

  const total = Object.values(values).reduce((a, b) => a + b, 0)

  useEffect(() => {
    if (state?.ok) {
      toast.success("Score saved")
      router.refresh()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state, router])

  if (locked) {
    return (
      <div className="neu rounded-[1.75rem] p-6 text-center text-muted-foreground">
        This team already has 2 judges assigned. You cannot score it.
      </div>
    )
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="team_id" value={teamId} />

      <div className="hero-card sticky top-20 z-10 rounded-[1.75rem] p-5">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">Total Score</span>
          <span className="text-3xl font-bold tabular-nums">
            {total}
            <span className="text-base text-white/50"> / 100</span>
          </span>
        </div>
      </div>

      {FACTORS.map((f) => (
        <div key={f.name} className="neu rounded-[1.75rem] p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Label htmlFor={f.name} className="text-sm font-medium">
              {f.label}
            </Label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Decrease ${f.label}`}
                onClick={() => setValues((v) => ({ ...v, [f.name]: Math.max(0, v[f.name] - 1) }))}
                className="neu-sm flex size-8 items-center justify-center rounded-full text-lg font-bold leading-none text-primary transition active:scale-95"
              >
                −
              </button>
              <span className="neu-inset min-w-10 rounded-full px-2.5 py-1 text-center text-sm font-bold tabular-nums text-primary">
                {values[f.name]}
              </span>
              <button
                type="button"
                aria-label={`Increase ${f.label}`}
                onClick={() => setValues((v) => ({ ...v, [f.name]: Math.min(f.max, v[f.name] + 1) }))}
                className="neu-sm flex size-8 items-center justify-center rounded-full text-lg font-bold leading-none text-primary transition active:scale-95"
              >
                +
              </button>
            </div>
          </div>
          <input
            id={f.name}
            name={f.name}
            type="range"
            min={0}
            max={f.max}
            step={1}
            value={values[f.name]}
            onChange={(e) => setValues((v) => ({ ...v, [f.name]: Number(e.target.value) }))}
            className="score-range w-full"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>0</span>
            <span>{f.max}</span>
          </div>
        </div>
      ))}

      <div className="neu rounded-[1.75rem] p-5">
        <Label htmlFor="remark" className="text-sm font-medium">
          Remark
        </Label>
        <Textarea
          id="remark"
          name="remark"
          rows={3}
          defaultValue={existing?.remark ?? ""}
          placeholder="Feedback for this team..."
          className="neu-inset mt-2 rounded-2xl border-0 bg-transparent shadow-none"
        />
      </div>

      <Button type="submit" disabled={pending} size="lg" className="w-full rounded-2xl">
        {pending ? "Saving..." : existing ? "Update Score" : "Submit Score"}
      </Button>
    </form>
  )
}
