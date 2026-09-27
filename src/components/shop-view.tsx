import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { getCategories, getProducts } from "@/lib/products"
import { categorySlug } from "@/lib/store"
import { cn } from "@/lib/utils"

/** Product listing for /shop and /shop/[category]. `category` is the display name, or undefined for all. */
export async function ShopView({ category }: { category?: string }) {
  const [products, categories] = await Promise.all([getProducts({ category }), getCategories()])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">The collection</p>
        <h1 className="font-heading text-4xl sm:text-5xl">{category ?? "All bangles"}</h1>
        <p className="text-muted-foreground">
          {products.length} {products.length === 1 ? "design" : "designs"}
        </p>
      </div>

      {categories.length > 0 && (
        <div className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip href="/shop" active={!category}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip key={c} href={`/shop/${categorySlug(c)}`} active={category === c}>
              {c}
            </Chip>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed py-20 text-center text-muted-foreground">
          Nothing here yet — check back soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

export function ShopSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 sm:px-6">
      <div className="mb-10 h-12 w-64 rounded-lg bg-muted" />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-[4/5] rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={cn(
        "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
        active ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:border-foreground/40"
      )}
    >
      {children}
    </Link>
  )
}
