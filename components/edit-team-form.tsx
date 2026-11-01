"use client"

import { useActionState, useEffect, useState } from "react"
import { Pencil, X } from "lucide-react"
import { updateTeam, type Team } from "@/app/actions/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function EditTeamForm({ team }: { team: Team }) {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(updateTeam, undefined)

  useEffect(() => {
    if (state?.ok) {
      toast.success("Team details updated")
      setOpen(false)
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  if (!open) {
    return (
      <Button
        onClick={() => setOpen(true)}
        variant="secondary"
        className="w-full rounded-2xl"
        size="lg"
      >
        <Pencil className="size-4" />
        Edit team details
      </Button>
    )
  }

  return (
    <div className="neu rounded-[1.75rem] p-5 animate-rise">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Edit Team Details</h2>
        <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground">
          <X className="size-5" />
        </button>
      </div>
      <form
        key={`${team.team_name}|${team.team_number}|${team.category}|${team.project_title}|${team.problem_statement}|${team.problem_description}|${team.members}`}
        action={action}
        className="space-y-3"
      >
        <input type="hidden" name="team_id" value={team.id} />
        <div className="grid grid-cols-2 gap-3">
          <Field name="team_number" label="Team No." defaultValue={team.team_number} />
          <Field name="category" label="Category" defaultValue={team.category} />
        </div>
        <Field name="team_name" label="Team Name" defaultValue={team.team_name} required />
        <Field name="project_title" label="Project Title" defaultValue={team.project_title} />
        <div className="space-y-1.5">
          <Label htmlFor="edit_problem_statement">Problem Statement</Label>
          <Textarea
            id="edit_problem_statement"
            name="problem_statement"
            rows={2}
            defaultValue={team.problem_statement ?? ""}
            className="neu-inset rounded-2xl border-0 bg-transparent shadow-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit_problem_description">Problem Description</Label>
          <Textarea
            id="edit_problem_description"
            name="problem_description"
            rows={4}
            defaultValue={team.problem_description ?? ""}
            className="neu-inset rounded-2xl border-0 bg-transparent shadow-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edit_members">Members (comma separated)</Label>
          <Textarea
            id="edit_members"
            name="members"
            rows={2}
            defaultValue={team.members ?? ""}
            className="neu-inset rounded-2xl border-0 bg-transparent shadow-none"
          />
        </div>
        <Button type="submit" disabled={pending} className="w-full rounded-2xl" size="lg">
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  )
}

function Field({
  name,
  label,
  defaultValue,
  required,
}: {
  name: string
  label: string
  defaultValue?: string | null
  required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={`edit_${name}`}>
        {label}
        {required ? " *" : ""}
      </Label>
      <Input
        id={`edit_${name}`}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="neu-inset rounded-2xl border-0 bg-transparent shadow-none"
      />
    </div>
  )
}
