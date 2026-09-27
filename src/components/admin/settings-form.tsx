"use client"

import { useActionState, useEffect, useState } from "react"
import { ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { saveSettings } from "@/app/admin/actions"
import type { StoreSettings } from "@/lib/settings"
import { normalizeWhatsapp, whatsappChatLink } from "@/lib/store"

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [state, action, pending] = useActionState(saveSettings, undefined)
  const [name, setName] = useState(settings.name)
  const [tagline, setTagline] = useState(settings.tagline)
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp ? `+${settings.whatsapp}` : "")
  const digits = normalizeWhatsapp(whatsapp)

  useEffect(() => {
    if (state?.saved) toast.success("Settings saved — your store is updated")
  }, [state])

  return (
    <form action={action} className="space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">Store details</h2>
          <p className="text-sm text-muted-foreground">Shown in the header, footer, browser tab and WhatsApp messages.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Store name</Label>
          <Input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={60} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tagline">Tagline</Label>
          <Textarea
            id="tagline"
            name="tagline"
            rows={2}
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            maxLength={160}
          />
          <p className="text-xs text-muted-foreground">Appears in the footer and in search results.</p>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-semibold">WhatsApp orders</h2>
          <p className="text-sm text-muted-foreground">
            Customers who tap <strong>Buy on WhatsApp</strong> message this number. It also powers the &ldquo;Chat with
            us&rdquo; buttons.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp number</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Include your country code (e.g. +91 India, +92 Pakistan, +971 UAE). Spaces and dashes are fine.
          </p>
        </div>
        {!settings.whatsapp && !state?.saved && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
            No number set yet — the Buy on WhatsApp button is disabled on your store until you save one.
          </p>
        )}
        {digits.length >= 8 && (
          <a
            href={whatsappChatLink(digits, "Test message from my store settings")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border px-3 text-sm font-medium hover:bg-muted"
          >
            <ExternalLink className="size-4" /> Test this number
          </a>
        )}
      </section>

      {state?.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}

      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  )
}
