import { PageHeading } from "@/components/page-heading"
import { KeyManager } from "@/components/key-manager"
import { getJudges } from "@/app/actions/data"

export default async function KeysPage() {
  const judges = await getJudges()
  return (
    <div className="space-y-5">
      <PageHeading title="Judge Keys" subtitle="Generate and manage access keys" />
      <KeyManager judges={judges} />
    </div>
  )
}
