export function PageHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-1">
      <h1 className="text-balance text-2xl font-semibold leading-tight">{title}</h1>
      {subtitle ? <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p> : null}
    </div>
  )
}
