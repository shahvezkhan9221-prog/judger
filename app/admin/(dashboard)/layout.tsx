import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { getAdminId } from "@/lib/session"
import { createAdminClient } from "@/lib/supabase/admin"
import { adminLogout } from "@/app/actions/auth"
import { PortalNav, type NavItem } from "@/components/portal-nav"
import { PortalHeader } from "@/components/portal-header"

const NAV: NavItem[] = [
  { href: "/admin", label: "Leaderboard", icon: "dashboard" },
  { href: "/admin/teams", label: "Teams", icon: "teams" },
  { href: "/admin/keys", label: "Keys", icon: "keys" },
]

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const adminId = await getAdminId()
  if (!adminId) redirect("/admin/login")

  const supabase = createAdminClient()
  const { data } = await supabase.from("admins").select("name").eq("id", adminId).maybeSingle()

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-36 pt-4">
      <PortalHeader role="Administrator" name={data?.name ?? "Organizer"} logoutAction={adminLogout} />
      {children}
      <PortalNav items={NAV} />
    </div>
  )
}
