"use server"

import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"
import { getAdminId, getJudgeId } from "@/lib/session"

/* ---------------- Types ---------------- */

export type Team = {
  id: string
  team_number: string | null
  team_name: string
  project_title: string | null
  problem_statement: string | null
  problem_description: string | null
  category: string | null
  members: string | null
  created_at: string
}

export type Judge = {
  id: string
  judge_name: string
  access_key: string
  is_active: boolean
  created_at: string
}

export type LeaderboardRow = {
  id: string
  team_name: string
  team_number: string | null
  project_title: string | null
  category: string | null
  judges_count: number
  avg_total: number
  avg_problem: number
  avg_innovation: number
  avg_presentation: number
}

export type ScoreRow = {
  id: string
  team_id: string
  judge_id: string
  problem_identification: number
  innovation_creativity: number
  presentation_skills: number
  implementation_strategy: number
  potential_impact_relevance: number
  scalability_sustainability: number
  presentation_clarity: number
  remark: string | null
  updated_at: string
  judges?: { judge_name: string } | null
}

/* ---------------- Admin: Teams ---------------- */

export async function addTeam(_prev: { error?: string; ok?: boolean } | undefined, formData: FormData) {
  if (!(await getAdminId())) return { error: "Not authorized." }

  const team_name = String(formData.get("team_name") ?? "").trim()
  if (!team_name) return { error: "Team name is required." }

  const supabase = createAdminClient()
  const { error } = await supabase.from("teams").insert({
    team_name,
    team_number: emptyToNull(formData.get("team_number")),
    project_title: emptyToNull(formData.get("project_title")),
    problem_statement: emptyToNull(formData.get("problem_statement")),
    problem_description: emptyToNull(formData.get("problem_description")),
    category: emptyToNull(formData.get("category")),
    members: emptyToNull(formData.get("members")),
  })

  if (error) return { error: "Could not add team. Please try again." }
  revalidatePath("/admin/teams")
  revalidatePath("/admin")
  return { ok: true }
}

export async function updateTeam(_prev: { error?: string; ok?: boolean } | undefined, formData: FormData) {
  if (!(await getAdminId())) return { error: "Not authorized." }

  const teamId = String(formData.get("team_id") ?? "")
  if (!teamId) return { error: "Missing team." }

  const team_name = String(formData.get("team_name") ?? "").trim()
  if (!team_name) return { error: "Team name is required." }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from("teams")
    .update({
      team_name,
      team_number: emptyToNull(formData.get("team_number")),
      project_title: emptyToNull(formData.get("project_title")),
      problem_statement: emptyToNull(formData.get("problem_statement")),
      problem_description: emptyToNull(formData.get("problem_description")),
      category: emptyToNull(formData.get("category")),
      members: emptyToNull(formData.get("members")),
    })
    .eq("id", teamId)

  if (error) return { error: "Could not save changes. Please try again." }
  revalidatePath(`/admin/teams/${teamId}`)
  revalidatePath("/admin/teams")
  revalidatePath("/admin")
  return { ok: true }
}

export async function deleteTeam(teamId: string) {
  if (!(await getAdminId())) return { error: "Not authorized." }
  const supabase = createAdminClient()
  const { error } = await supabase.from("teams").delete().eq("id", teamId)
  if (error) return { error: "Could not delete team." }
  revalidatePath("/admin/teams")
  revalidatePath("/admin")
  return { ok: true }
}

export async function getTeams(): Promise<Team[]> {
  const supabase = createAdminClient()
  const { data } = await supabase.from("teams").select("*").order("created_at", { ascending: false })
  return (data as Team[]) ?? []
}

export async function getTeam(teamId: string): Promise<Team | null> {
  const supabase = createAdminClient()
  const { data } = await supabase.from("teams").select("*").eq("id", teamId).maybeSingle()
  return (data as Team) ?? null
}

/* ---------------- Admin: Leaderboard & team scores ---------------- */

export async function getLeaderboard(): Promise<LeaderboardRow[]> {
  const supabase = createAdminClient()
  const { data } = await supabase.from("leaderboard").select("*")
  const rows = (data as LeaderboardRow[]) ?? []
  return rows.sort((a, b) => b.avg_total - a.avg_total)
}

export async function getTeamScores(teamId: string): Promise<ScoreRow[]> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("scores")
    .select("*, judges(judge_name)")
    .eq("team_id", teamId)
    .order("created_at", { ascending: true })
  return (data as ScoreRow[]) ?? []
}

/* ---------------- Admin: Judge keys ---------------- */

export async function generateKey(_prev: { error?: string; ok?: boolean } | undefined, formData: FormData) {
  if (!(await getAdminId())) return { error: "Not authorized." }
  const judge_name = String(formData.get("judge_name") ?? "").trim()
  if (!judge_name) return { error: "Enter the judge's name." }

  const access_key = `ANVESH26-${randomBytes(12).toString("hex").toUpperCase()}`
  const supabase = createAdminClient()
  const { error } = await supabase.from("judges").insert({ judge_name, access_key })
  if (error) return { error: "Could not generate key. Please try again." }
  revalidatePath("/admin/keys")
  return { ok: true }
}

export async function getJudges(): Promise<Judge[]> {
  const supabase = createAdminClient()
  const { data } = await supabase.from("judges").select("*").order("created_at", { ascending: false })
  return (data as Judge[]) ?? []
}

export async function toggleJudge(judgeId: string, isActive: boolean) {
  if (!(await getAdminId())) return { error: "Not authorized." }
  const supabase = createAdminClient()
  const { error } = await supabase.from("judges").update({ is_active: isActive }).eq("id", judgeId)
  if (error) return { error: "Could not update key." }
  revalidatePath("/admin/keys")
  return { ok: true }
}

/* ---------------- Judge: search, view, score ---------------- */

export async function searchTeams(query: string): Promise<Team[]> {
  if (!(await getJudgeId())) return []
  const supabase = createAdminClient()
  const q = query.trim()
  let req = supabase.from("teams").select("*").order("team_name", { ascending: true })
  if (q) req = req.or(`team_name.ilike.%${q}%,team_number.ilike.%${q}%,project_title.ilike.%${q}%`)
  const { data } = await req
  return (data as Team[]) ?? []
}

export async function isTeamLockedForMe(teamId: string): Promise<boolean> {
  const judgeId = await getJudgeId()
  if (!judgeId) return true
  const supabase = createAdminClient()
  const { data } = await supabase.from("scores").select("judge_id").eq("team_id", teamId)
  const rows = data ?? []
  const iScored = rows.some((r) => r.judge_id === judgeId)
  // locked only if 2 other judges already scored and I'm not one of them
  return !iScored && rows.length >= 2
}

export async function getMyScore(teamId: string): Promise<ScoreRow | null> {
  const judgeId = await getJudgeId()
  if (!judgeId) return null
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("scores")
    .select("*")
    .eq("team_id", teamId)
    .eq("judge_id", judgeId)
    .maybeSingle()
  return (data as ScoreRow) ?? null
}

export async function submitScore(
  _prev: { error?: string; ok?: boolean } | undefined,
  formData: FormData,
) {
  const judgeId = await getJudgeId()
  if (!judgeId) return { error: "Not authorized." }

  const teamId = String(formData.get("team_id") ?? "")
  if (!teamId) return { error: "Missing team." }

  const pi = clampScore(formData.get("problem_identification"))
  const ic = clampScore(formData.get("innovation_creativity"))
  const ps = clampScore(formData.get("presentation_skills"), 15)
  const implementationStrategy = clampScore(formData.get("implementation_strategy"), 15)
  const potentialImpactRelevance = clampScore(formData.get("potential_impact_relevance"), 15)
  const scalabilitySustainability = clampScore(formData.get("scalability_sustainability"), 15)
  const presentationClarity = clampScore(formData.get("presentation_clarity"), 10)
  const remark = emptyToNull(formData.get("remark"))

  const supabase = createAdminClient()

  // does this judge already have a score row for this team? (update path is always allowed)
  const { data: existing } = await supabase
    .from("scores")
    .select("id")
    .eq("team_id", teamId)
    .eq("judge_id", judgeId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from("scores")
      .update({
        problem_identification: pi,
        innovation_creativity: ic,
        presentation_skills: ps,
        implementation_strategy: implementationStrategy,
        potential_impact_relevance: potentialImpactRelevance,
        scalability_sustainability: scalabilitySustainability,
        presentation_clarity: presentationClarity,
        remark,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
    if (error) return { error: "Could not save your score." }
  } else {
    const { error } = await supabase.from("scores").insert({
      team_id: teamId,
      judge_id: judgeId,
      problem_identification: pi,
      innovation_creativity: ic,
      presentation_skills: ps,
      implementation_strategy: implementationStrategy,
      potential_impact_relevance: potentialImpactRelevance,
      scalability_sustainability: scalabilitySustainability,
      presentation_clarity: presentationClarity,
      remark,
    })
    if (error) {
      // trigger raises when a 3rd judge tries to score
      if (error.message?.toLowerCase().includes("maximum")) {
        return { error: "This team already has 2 judges. You cannot score it." }
      }
      return { error: "Could not save your score." }
    }
  }

  revalidatePath("/judge")
  return { ok: true }
}

/* ---------------- helpers ---------------- */

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim()
  return s.length ? s : null
}

function clampScore(v: FormDataEntryValue | null, max = 15): number {
  const n = Math.round(Number(v ?? 0))
  if (Number.isNaN(n)) return 0
  return Math.max(0, Math.min(max, n))
}
