// Shared (client + server) formatting config, read from public env vars.
// Store name, tagline and WhatsApp number live in the database — see src/lib/settings.ts.
export const store = {
  currency: process.env.NEXT_PUBLIC_CURRENCY || "USD",
  // Fixed locale so server and browser format prices identically (e.g. en-IN, en-PK, en-US).
  locale: process.env.NEXT_PUBLIC_LOCALE || "en-US",
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat(store.locale, {
    style: "currency",
    currency: store.currency,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value)
}

/** "Thread & Silk" → "thread-silk" — used for /shop/[category] URLs. */
export function categorySlug(category: string) {
  return category
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// ── Sizes ───────────────────────────────────────────────────────────

export const SIZE_UNITS = [
  { value: "bangle", label: "Bangle size (2.2, 2.4, 2.6…)", short: "Bangle size" },
  { value: "in", label: "Inches", short: "in" },
  { value: "cm", label: "Centimetres", short: "cm" },
  { value: "mm", label: "Millimetres", short: "mm" },
  { value: "free", label: "Free size / adjustable", short: "Free size" },
] as const

export type SizeUnit = (typeof SIZE_UNITS)[number]["value"]

export function isSizeUnit(value: unknown): value is SizeUnit {
  return SIZE_UNITS.some((u) => u.value === value)
}

/** "2.4" → "2.4" for bangle sizes, "6" → "6 cm" for measured units. */
export function formatSize(size: string, unit: SizeUnit) {
  if (unit === "bangle" || unit === "free") return size
  return `${size} ${unit}`
}

export function sizeUnitName(unit: SizeUnit) {
  return SIZE_UNITS.find((u) => u.value === unit)?.short ?? unit
}

// ── WhatsApp ────────────────────────────────────────────────────────

/** "+91 98765-43210" → "919876543210" (wa.me wants digits only, with country code). */
export function normalizeWhatsapp(raw: string) {
  return raw.replace(/\D/g, "")
}

export function whatsappChatLink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function whatsappGreeting(storeName: string) {
  return `Hi ${storeName}! I have a question.`
}

export function whatsappOrderLink(opts: {
  number: string
  storeName: string
  name: string
  price: number
  quantity: number
  size?: { value: string; unit: SizeUnit }
  url?: string
}) {
  const lines = [`Hi ${opts.storeName}! I'd like to order:`, "", `*${opts.name}*`]
  if (opts.size) {
    const { value, unit } = opts.size
    lines.push(`Size: ${formatSize(value, unit)}${unit === "bangle" ? " (bangle size)" : ""}`)
  }
  lines.push(
    `Quantity: ${opts.quantity}`,
    `Price: ${formatPrice(opts.price)} each`,
    `Total: *${formatPrice(opts.price * opts.quantity)}*`
  )
  if (opts.url) lines.push("", opts.url)
  return whatsappChatLink(opts.number, lines.join("\n"))
}
