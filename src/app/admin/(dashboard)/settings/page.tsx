import { Card, CardContent } from "@/components/ui/card"
import { SettingsForm } from "@/components/admin/settings-form"
import { requireAdmin } from "@/lib/auth"
import { getSettings } from "@/lib/settings"

export default async function SettingsPage() {
  await requireAdmin()
  const settings = await getSettings()

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-extrabold">Settings</h1>
      <Card>
        <CardContent>
          <SettingsForm settings={settings} />
        </CardContent>
      </Card>
    </div>
  )
}
