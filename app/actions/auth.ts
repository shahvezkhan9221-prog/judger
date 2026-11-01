"use server"

import { redirect } from "next/navigation"
import { createAdminClient } from "@/lib/supabase/admin"
import {
  setAdminSession,
  setJudgeSession,
  clearAdminSession,
  clearJudgeSession,
} from "@/lib/session"

export type AuthState = { error?: string } | undefined

export async function adminLogin(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) return { error: "Enter your email and password." }

  const supabase = createAdminClient()

  // verify password with pgcrypto's crypt() by comparing hashes server-side
  const { data, error } = await supabase.rpc("verify_admin", {
    p_email: email,
    p_password: password,
  })

  if (error) {
    return { error: "Something went wrong. Please try again." }
  }
  if (!data) {
    return { error: "Invalid email or password." }
  }

  await setAdminSession(data as string)
  redirect("/admin")
}

export async function judgeLogin(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const key = String(formData.get("key") ?? "").trim()
  if (!key) return { error: "Enter your access key." }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("judges")
    .select("id, is_active")
    .eq("access_key", key)
    .maybeSingle()

  if (error) return { error: "Something went wrong. Please try again." }
  if (!data) return { error: "Invalid access key." }
  if (!data.is_active) return { error: "This access key has been revoked." }

  await setJudgeSession(data.id)
  redirect("/judge")
}

export async function adminLogout() {
  await clearAdminSession()
  redirect("/")
}

export async function judgeLogout() {
  await clearJudgeSession()
  redirect("/")
}
