import { LogOut } from "lucide-react"
import { BrandMark } from "@/components/brand"

export function PortalHeader({
  role,
  name,
  logoutAction,
}: {
  role: string
  name?: string | null
  logoutAction: () => Promise<void>
}) {
  return (
    <header className="glass sticky top-0 z-30 -mx-5 mb-6 flex items-center justify-between px-5 py-3.5 backdrop-blur">
      <BrandMark />
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-[11px] text-muted-foreground">{role}</p>
          {name ? <p className="max-w-[9rem] truncate text-sm font-semibold">{name}</p> : null}
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            aria-label="Log out"
            className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground transition-colors hover:bg-destructive hover:text-primary-foreground"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </form>
      </div>
    </header>
  )
}
