import { createClient } from "@supabase/supabase-js"

// Server-only Supabase client using the service role key.
// All privileged DB access in this app goes through server actions using this client.
// RLS is enabled on every table with no anon policies, so the anon key cannot read/write.
export function createAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service credentials")
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
