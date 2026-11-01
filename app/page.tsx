import Link from "next/link"
import { redirect } from "next/navigation"
import { ShieldCheck, KeyRound, ArrowRight, Trophy, Sparkles } from "lucide-react"
import { BrandMark } from "@/components/brand"
import { Orb } from "@/components/orb"
import { getAdminId, getJudgeId } from "@/lib/session"

export default async function LandingPage() {
  // send logged-in users straight to their portal
  if (await getAdminId()) redirect("/admin")
  if (await getJudgeId()) redirect("/judge")

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-8">
      <header className="flex items-center justify-between">
        <BrandMark />
        <span className="neu-sm rounded-full px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
          SIH 2026
        </span>
      </header>

      <section className="mt-8 flex flex-col items-center text-center animate-rise">
        <Orb className="size-28">
          <Trophy className="size-10" aria-hidden />
        </Orb>
        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-mint/40 px-3 py-1 text-xs font-semibold text-mint-foreground">
          <Sparkles className="size-3.5" aria-hidden />
          Live Hackathon Judging
        </div>
        <h1 className="mt-4 text-pretty text-4xl font-extrabold leading-[1.05] tracking-tight">
          Judge teams. Track scores. Crown winners.
        </h1>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          The internal judging portal for GLA University&apos;s Smart India Hackathon. Choose how you want to sign in.
        </p>
      </section>

      <section className="mt-8 flex flex-col gap-4">
        <Link
          href="/admin/login"
          className="neu neu-hover group flex items-center gap-4 rounded-[1.75rem] p-5 animate-rise"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <ShieldCheck className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold tracking-tight">Login as Administrator</p>
            <p className="text-xs text-muted-foreground">Organizer controls, teams &amp; keys</p>
          </div>
          <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>

        <Link
          href="/judge/login"
          className="neu neu-hover group flex items-center gap-4 rounded-[1.75rem] p-5 animate-rise"
          style={{ animationDelay: "140ms" }}
        >
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-mint text-mint-foreground shadow-lg shadow-mint/40">
            <KeyRound className="size-6" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold tracking-tight">Login as Judge</p>
            <p className="text-xs text-muted-foreground">Sign in with your access key</p>
          </div>
          <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </section>

      <section className="mt-8 neu rounded-[1.75rem] p-5 animate-rise" style={{ animationDelay: "200ms" }}>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Trophy className="size-4 text-primary" aria-hidden />
          Judged on three factors
        </div>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
          <li className="flex items-center justify-between">
            <span>Problem Identification</span>
            <span className="font-semibold text-foreground">/ 10</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Innovation &amp; Creativity</span>
            <span className="font-semibold text-foreground">/ 10</span>
          </li>
          <li className="flex items-center justify-between">
            <span>Presentation Skills</span>
            <span className="font-semibold text-foreground">/ 10</span>
          </li>
        </ul>
      </section>

      <footer className="mt-auto pt-8 text-center text-[11px] text-muted-foreground">
        GLA University · SIH Internal · For authorized organizers &amp; judges only
      </footer>
    </main>
  )
}
