"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { formatPrice, formatSize, sizeUnitName, whatsappOrderLink, type SizeUnit } from "@/lib/store"
import { cn } from "@/lib/utils"

const MAX_QTY = 99

type Props = {
  name: string
  price: number
  inStock: boolean
  sizes: string[]
  sizeUnit: SizeUnit
  /** Store WhatsApp number (digits only); empty when not configured. */
  whatsapp: string
  storeName: string
}

export function BuyBox({ name, price, inStock, sizes, sizeUnit, whatsapp, storeName }: Props) {
  const [qty, setQty] = useState(1)
  const needsSize = sizeUnit !== "free" && sizes.length > 1
  const [size, setSize] = useState<string | null>(sizes.length === 1 ? sizes[0] : null)
  const [showSizeHint, setShowSizeHint] = useState(false)

  function order() {
    if (needsSize && !size) {
      setShowSizeHint(true)
      return
    }
    const url = whatsappOrderLink({
      number: whatsapp,
      storeName,
      name,
      price,
      quantity: qty,
      size: size ? { value: size, unit: sizeUnit } : undefined,
      url: window.location.href,
    })
    window.open(url, "_blank", "noopener,noreferrer")
  }

  if (!inStock) {
    return (
      <div className="rounded-xl border border-dashed p-5 text-center">
        <p className="font-semibold">Currently sold out</p>
        <p className="mt-1 text-sm text-muted-foreground">Message us on WhatsApp to ask about restocks.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 rounded-xl border bg-card p-5 sm:p-6">
      {sizeUnit === "free" ? (
        <p className="text-sm">
          <span className="font-semibold">Size:</span> <span className="text-muted-foreground">Free size / adjustable</span>
        </p>
      ) : sizes.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">
              Size <span className="font-normal text-muted-foreground">({sizeUnitName(sizeUnit)})</span>
            </span>
            {sizeUnit === "bangle" && (
              <Link
                href="/#size-guide"
                className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                <Ruler className="size-3.5" /> Size guide
              </Link>
            )}
          </div>
          <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => {
                  setSize(s)
                  setShowSizeHint(false)
                }}
                className={cn(
                  "min-w-14 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                  size === s
                    ? "border-primary bg-primary text-primary-foreground"
                    : "bg-background hover:border-foreground/40"
                )}
              >
                {formatSize(s, sizeUnit)}
              </button>
            ))}
          </div>
          {showSizeHint && <p className="text-sm font-medium text-destructive">Please choose a size first.</p>}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold">Quantity</span>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus />
          </Button>
          <span className="w-8 text-center font-bold tabular-nums" aria-live="polite">
            {qty}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
            disabled={qty >= MAX_QTY}
            aria-label="Increase quantity"
          >
            <Plus />
          </Button>
        </div>
      </div>

      <div className="flex items-baseline justify-between border-t pt-5">
        <span className="text-muted-foreground">Total</span>
        <span className="font-heading text-3xl">{formatPrice(price * qty)}</span>
      </div>

      <Button
        size="lg"
        className="h-12 w-full bg-[#25D366] text-base font-semibold text-white hover:bg-[#1fb857]"
        onClick={order}
        disabled={!whatsapp}
      >
        <WhatsAppIcon className="size-5" />
        Buy on WhatsApp
      </Button>
      {!whatsapp && (
        <p className="text-center text-xs text-destructive">
          Ordering opens soon — the store hasn&apos;t set up WhatsApp yet.
        </p>
      )}
    </div>
  )
}
