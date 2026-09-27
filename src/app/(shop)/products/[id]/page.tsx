import type { Metadata } from "next"
import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight, MessageCircleQuestion, PackageCheck, Ruler } from "lucide-react"
import { BuyBox } from "@/components/buy-box"
import { ProductCard, ProductImage } from "@/components/product-card"
import { getProduct, getProductIds, getProducts } from "@/lib/products"
import { getSettings } from "@/lib/settings"
import { categorySlug, formatPrice } from "@/lib/store"

// Prerender every product at build time; products added later are built on first visit, then cached.
export async function generateStaticParams() {
  const ids = await getProductIds()
  return ids.map((id) => ({ id }))
}

export async function generateMetadata(props: PageProps<"/products/[id]">): Promise<Metadata> {
  const product = await getProduct((await props.params).id)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: product.image_url ? { images: [product.image_url] } : undefined,
  }
}

export default function ProductPage(props: PageProps<"/products/[id]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductDetails params={props.params} />
    </Suspense>
  )
}

function ProductSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl animate-pulse gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 lg:gap-14">
      <div className="aspect-[4/5] rounded-2xl bg-muted" />
      <div className="space-y-4">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-10 w-3/4 rounded bg-muted" />
        <div className="h-7 w-28 rounded bg-muted" />
        <div className="h-64 rounded-xl bg-muted" />
      </div>
    </div>
  )
}

async function ProductDetails({ params }: Pick<PageProps<"/products/[id]">, "params">) {
  const [product, { name: storeName, whatsapp }] = await Promise.all([getProduct((await params).id), getSettings()])
  if (!product) notFound()

  const related = product.category
    ? (await getProducts({ category: product.category, limit: 5 })).filter((p) => p.id !== product.id).slice(0, 4)
    : []

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="size-3.5" />
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>
        {product.category && (
          <>
            <ChevronRight className="size-3.5" />
            <Link href={`/shop/${categorySlug(product.category)}`} className="hover:text-foreground">
              {product.category}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
          <ProductImage product={product} sizes="(min-width: 768px) 50vw, 100vw" priority />
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            {product.category && (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{product.category}</p>
            )}
            <h1 className="font-heading text-3xl leading-tight sm:text-4xl">{product.name}</h1>
            <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
          </div>

          {product.description && (
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          <BuyBox
            name={product.name}
            price={product.price}
            inStock={product.in_stock}
            sizes={product.sizes}
            sizeUnit={product.size_unit}
            whatsapp={whatsapp}
            storeName={storeName}
          />

          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Ruler className="size-4 shrink-0 text-foreground" /> Unsure of your size? Check the{" "}
              <Link href="/#size-guide" className="-ml-2 font-medium text-foreground underline underline-offset-4">
                size guide
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircleQuestion className="size-4 shrink-0 text-foreground" /> Payment & delivery are confirmed
              with you on WhatsApp
            </li>
            <li className="flex items-center gap-3">
              <PackageCheck className="size-4 shrink-0 text-foreground" /> Carefully packed so every piece arrives safe
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-heading text-3xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
