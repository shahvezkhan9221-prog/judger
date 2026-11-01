import "server-only"
import { cookies } from "next/headers"
import { createHmac, timingSafeEqual } from "crypto"

const ADMIN_COOKIE = "sih_admin"
const JUDGE_COOKIE = "sih_judge"
const MAX_AGE = 60 * 60 * 12 // 12 hours

function secret() {
  return process.env.SUPABASE_JWT_SECRET ?? "sih-fallback-secret-change-me"
}

// signed value: `${payload}.${hmac}`
function sign(payload: string) {
  const mac = createHmac("sha256", secret()).update(payload).digest("hex")
  return `${payload}.${mac}`
}

function verify(signed: string | undefined): string | null {
  if (!signed) return null
  const idx = signed.lastIndexOf(".")
  if (idx < 0) return null
  const payload = signed.slice(0, idx)
  const mac = signed.slice(idx + 1)
  const expected = createHmac("sha256", secret()).update(payload).digest("hex")
  try {
    const a = Buffer.from(mac, "hex")
    const b = Buffer.from(expected, "hex")
    if (a.length !== b.length) return null
    if (!timingSafeEqual(a, b)) return null
    return payload
  } catch {
    return null
  }
}

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
}

export async function setAdminSession(adminId: string) {
  const store = await cookies()
  store.set(ADMIN_COOKIE, sign(`admin:${adminId}`), cookieOpts)
}

export async function setJudgeSession(judgeId: string) {
  const store = await cookies()
  store.set(JUDGE_COOKIE, sign(`judge:${judgeId}`), cookieOpts)
}

export async function getAdminId(): Promise<string | null> {
  const store = await cookies()
  const payload = verify(store.get(ADMIN_COOKIE)?.value)
  if (!payload?.startsWith("admin:")) return null
  return payload.slice("admin:".length)
}

export async function getJudgeId(): Promise<string | null> {
  const store = await cookies()
  const payload = verify(store.get(JUDGE_COOKIE)?.value)
  if (!payload?.startsWith("judge:")) return null
  return payload.slice("judge:".length)
}

export async function clearAdminSession() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
}

export async function clearJudgeSession() {
  const store = await cookies()
  store.delete(JUDGE_COOKIE)
}
