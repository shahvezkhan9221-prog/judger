"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { Plus, X } from "lucide-react"
import { addTeam } from "@/app/actions/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function AddTeamForm() {
  const [open, setOpen] = useState(false)
  const [state, action, pending] = useActionState(addTeam, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) {
      toast.success("Team added")
      formRef.current?.reset()
      setOpen(false)
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="w-full rounded-2xl" size="lg">
        <Plus className="size-4" />
        Add Team
      </Button>
    )
  }

  return (
    <div className="neu rounded-[1.75rem] p-5 animate-rise">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">New Team</h2>
        <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted-foreground">
          <X className="size-5" />
        </button>
      </div>
      <form ref={formRef} action={action} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field name="team_number" label="Team No." />
          <Field name="category" label="Category" />
        </div>
        <Field name="team_name" label="Team Name" required />
        <Field name="project_title" label="Project Title" />
        <div className="space-y-1.5">
          <Label htmlFor="problem_statement">Problem Statement</Label>
          <Textarea id="problem_statement" name="problem_statement" rows={2} className="neu-inset rounded-2xl border-0 bg-transparent shadow-none" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="problem_description">Problem Description</Label>
          <Textarea id="problem_description" name="problem_description" rows={3} className="neu-inset rounded-2xl border-0 bg-transparent shadow-none" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="members">Members (comma separated)</Label>
          <Textarea id="members" name="members" rows={2} className="neu-inset rounded-2xl border-0 bg-transparent shadow-none" />
        </div>
        <Button type="submit" disabled={pending} className="w-full rounded-2xl" size="lg">
          {pending ? "Saving..." : "Save Team"}
        </Button>
      </form>
    </div>
  )
}

function Field({ name, label, required }: { name: string; label: string; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>
        {label}
        {required ? " *" : ""}
      </Label>
      <Input id={name} name={name} required={required} className="neu-inset rounded-2xl border-0 bg-transparent shadow-none" />
    </div>
  )
}
