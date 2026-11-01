"use client"

import { useActionState } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, Loader2 } from "lucide-react"
import { adminLogin, type AuthState } from "@/app/actions/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Orb } from "@/components/orb"

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(adminLogin, undefined)

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 rounded-full px-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back
      </Link>

      <div className="mt-8 flex flex-col items-center text-center animate-rise">
        <Orb className="size-24">
          <ShieldCheck className="size-9" aria-hidden />
        </Orb>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Administrator</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Organizer access for GLA University SIH</p>
      </div>

      <form
        action={action}
        className="neu mt-9 flex flex-col gap-5 rounded-[2rem] p-6 animate-rise"
        style={{ animationDelay: "80ms" }}
      >
        <div className="grid gap-2">
          <Label htmlFor="email" className="pl-1 text-xs uppercase tracking-wide text-muted-foreground">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="admin@gla.ac.in"
            required
            className="neu-inset h-12 rounded-2xl border-0 bg-transparent px-4 shadow-none focus-visible:ring-2 focus-visible:ring-primary/40"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password" className="pl-1 text-xs uppercase tracking-wide text-muted-foreground">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            className="neu-inset h-12 rounded-2xl border-0 bg-transparent px-4 shadow-none focus-visible:ring-2 focus-visible:ring-primary/40"
          />
        </div>

        {state?.error ? (
          <p role="alert" className="rounded-2xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {state.error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={pending}
          className="h-12 rounded-2xl text-base font-semibold shadow-lg shadow-primary/30 transition-transform active:scale-[0.98]"
        >
          {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Are you a judge?{" "}
        <Link href="/judge/login" className="font-semibold text-primary underline-offset-2 hover:underline">
          Use your access key
        </Link>
      </p>
    </main>
  )
}
