import { createBrowserClient } from "@supabase/ssr"

// Singleton browser client — used ONLY for realtime subscriptions (no data reads).
// All data access happens server-side via service-role actions; RLS blocks anon reads.
let client: ReturnType<typeof createBrowserClient> | undefined

export function createClient() {
  if (client) return client
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
  return client
}
