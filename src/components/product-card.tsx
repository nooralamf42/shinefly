import Image from "next/image"
import Link from "next/link"
import { ImageIcon } from "lucide-react"
import { formatPrice, formatSize } from "@/lib/store"
import type { Product } from "@/lib/products"

export function ProductImage({ product, sizes, priority }: { product: Product; sizes: string; priority?: boolean }) {
  return product.image_url ? (
    <Image
      src={product.image_url}
      alt={product.name}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  ) : (
    <div className="grid size-full place-items-center text-muted-foreground/40">
      <ImageIcon className="size-10" />
    </div>
  )
}

function sizeSummary(p: Product) {
  if (p.size_unit === "free") return "Free size"
  if (p.sizes.length === 0) return null
  if (p.sizes.length === 1) return `Size ${formatSize(p.sizes[0], p.size_unit)}`
  return `${p.sizes.length} sizes`
}

export function ProductCard({ product }: { product: Product }) {
  const sizes = sizeSummary(product)
  return (
    <Link href={`/products/${product.id}`} className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
        <div className="relative size-full transition duration-500 group-hover:scale-105">
          <ProductImage product={product} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
        </div>
        {!product.in_stock && (
          <span className="absolute top-3 left-3 rounded-md bg-background/90 px-2 py-1 text-xs font-semibold">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 pt-3">
        {product.category && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold">{product.category}</span>
        )}
        <h3 className="line-clamp-2 font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline justify-between gap-2 pt-1">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {sizes && <span className="text-xs text-muted-foreground">{sizes}</span>}
        </div>
      </div>
    </Link>
  )
}
