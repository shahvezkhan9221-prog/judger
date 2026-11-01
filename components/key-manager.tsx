"use client"

import { useActionState, useEffect, useRef, useState, useTransition } from "react"
import { Check, Copy, KeyRound, Power } from "lucide-react"
import { generateKey, toggleJudge, type Judge } from "@/app/actions/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function KeyManager({ judges }: { judges: Judge[] }) {
  const [state, action, pending] = useActionState(generateKey, undefined)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) {
      toast.success("Access key generated")
      formRef.current?.reset()
    } else if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <div className="space-y-5">
      <div className="neu rounded-[1.75rem] p-5 animate-rise">
        <div className="mb-4 flex items-center gap-2">
          <KeyRound className="size-5 text-primary" />
          <h2 className="font-semibold">Generate Judge Key</h2>
        </div>
        <form ref={formRef} action={action} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="judge_name">Assign to (judge name) *</Label>
            <Input id="judge_name" name="judge_name" required placeholder="e.g. Dr. A. Sharma" className="neu-inset rounded-2xl border-0 bg-transparent shadow-none" />
          </div>
          <Button type="submit" disabled={pending} className="w-full rounded-2xl" size="lg">
            {pending ? "Generating..." : "Generate Key"}
          </Button>
        </form>
      </div>

      <div className="space-y-3">
        {judges.length === 0 && (
          <div className="neu rounded-[1.75rem] p-6 text-center text-muted-foreground">No keys generated yet.</div>
        )}
        {judges.map((j) => (
          <KeyCard key={j.id} judge={j} />
        ))}
      </div>
    </div>
  )
}

function KeyCard({ judge }: { judge: Judge }) {
  const [copied, setCopied] = useState(false)
  const [pending, start] = useTransition()

  function copy() {
    navigator.clipboard.writeText(judge.access_key)
    setCopied(true)
    toast.success("Key copied")
    setTimeout(() => setCopied(false), 1500)
  }

  function toggle() {
    start(async () => {
      const res = await toggleJudge(judge.id, !judge.is_active)
      if (res?.error) toast.error(res.error)
    })
  }

  return (
    <div className="neu rounded-[1.5rem] p-4 animate-rise">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold">{judge.judge_name}</p>
        <span
          className={`neu-inset rounded-full px-2.5 py-0.5 text-xs font-medium ${
            judge.is_active ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {judge.is_active ? "Active" : "Revoked"}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <code className="neu-inset min-w-0 flex-1 truncate rounded-2xl px-3 py-2 font-mono text-xs">
          {judge.access_key}
        </code>
        <button
          onClick={copy}
          aria-label="Copy key"
          className="neu-sm flex size-9 shrink-0 items-center justify-center rounded-2xl transition active:scale-95"
        >
          {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
        </button>
        <button
          onClick={toggle}
          disabled={pending}
          aria-label={judge.is_active ? "Revoke key" : "Reactivate key"}
          className="neu-sm flex size-9 shrink-0 items-center justify-center rounded-2xl transition active:scale-95 disabled:opacity-50"
        >
          <Power className={`size-4 ${judge.is_active ? "text-destructive" : "text-primary"}`} />
        </button>
      </div>
    </div>
  )
}
