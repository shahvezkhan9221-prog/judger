"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

// Keeps admin views fresh. Realtime fires instantly when RLS permits the event;
// a lightweight interval guarantees updates land even when realtime is filtered.
export function LiveRefresh({ intervalMs = 8000 }: { intervalMs?: number }) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel("sih-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "scores" }, () => {
        router.refresh()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "teams" }, () => {
        router.refresh()
      })
      .subscribe()

    const id = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh()
    }, intervalMs)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(id)
    }
  }, [router, intervalMs])

  return null
}
