"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, KeyRound } from "lucide-react"
import { cn } from "@/lib/utils"

const ICONS = {
  dashboard: LayoutDashboard,
  teams: Users,
  keys: KeyRound,
} as const

export type NavIconName = keyof typeof ICONS
export type NavItem = { href: string; label: string; icon: NavIconName }

export function PortalNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Portal navigation"
      className="neu fixed inset-x-0 bottom-0 z-40 mx-auto mb-4 w-[calc(100%-2rem)] max-w-md rounded-[1.75rem] p-2"
    >
      <ul className="flex items-center justify-around">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = ICONS[item.icon]
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
