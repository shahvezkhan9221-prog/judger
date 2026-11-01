"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Trash2 } from "lucide-react"
import { deleteTeam } from "@/app/actions/data"
import { toast } from "sonner"

export function DeleteTeamButton({ teamId }: { teamId: string }) {
  const router = useRouter()
  const [pending, start] = useTransition()

  function onDelete() {
    if (!confirm("Delete this team and all its scores? This cannot be undone.")) return
    start(async () => {
      const res = await deleteTeam(teamId)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Team deleted")
        router.push("/admin/teams")
      }
    })
  }

  return (
    <button
      onClick={onDelete}
      disabled={pending}
      className="flex items-center gap-2 rounded-2xl border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:opacity-50"
    >
      <Trash2 className="size-4" />
      {pending ? "Deleting..." : "Delete team"}
    </button>
  )
}
