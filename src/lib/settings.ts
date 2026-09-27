import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import { settings } from "@/lib/mongodb"

export const SETTINGS_TAG = "settings"

export const DEFAULT_SETTINGS = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "Kangan House",
  tagline: process.env.NEXT_PUBLIC_STORE_TAGLINE || "Handpicked bangles for every wrist and every occasion.",
}

export type StoreSettings = {
  name: string
  tagline: string
  /** Digits only, with country code, e.g. 919876543210. Empty when not set yet. */
  whatsapp: string
}

/**
 * Store settings edited from /admin/settings.
 * Cached until an admin saves settings (see `updateTag(SETTINGS_TAG)` in admin actions).
 */
export async function getSettings(): Promise<StoreSettings> {
  "use cache"
  cacheTag(SETTINGS_TAG)
  cacheLife("max")

  const doc = await settings().findOne({ _id: "store" })
  return {
    name: doc?.name || DEFAULT_SETTINGS.name,
    tagline: doc?.tagline || DEFAULT_SETTINGS.tagline,
    whatsapp: doc?.whatsapp ?? "",
  }
}
