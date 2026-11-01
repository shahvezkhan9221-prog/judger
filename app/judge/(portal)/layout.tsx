import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getJudgeId } from "@/lib/session"
import { createAdminClient } from "@/lib/supabase/admin"
import { judgeLogout } from "@/app/actions/auth"
import { PortalHeader } from "@/components/portal-header"

export default async function JudgePortalLayout({ children }: { children: ReactNode }) {
  const judgeId = await getJudgeId()
  if (!judgeId) redirect("/judge/login")

  const supabase = createAdminClient()
  const { data } = await supabase.from("judges").select("judge_name").eq("id", judgeId).maybeSingle()

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-16 pt-4">
      <PortalHeader role="Judge" name={data?.judge_name ?? "Judge"} logoutAction={judgeLogout} />
      {children}
    </div>
  )
}
