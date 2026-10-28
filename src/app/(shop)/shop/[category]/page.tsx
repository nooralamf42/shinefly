import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ShopSkeleton, ShopView } from "@/components/shop-view"
import { getCategories, getCategoryBySlug } from "@/lib/products"
import { categorySlug } from "@/lib/store"

// Prerender every collection at build time; new ones are built on first visit, then cached.
// Cache Components requires at least one param, so an empty store builds a placeholder that 404s.
export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.length > 0
    ? categories.map((c) => ({ category: categorySlug(c) }))
    : [{ category: "__placeholder__" }]
}

export async function generateMetadata(props: PageProps<"/shop/[category]">): Promise<Metadata> {
  const category = await getCategoryBySlug((await props.params).category)
  return category ? { title: category } : {}
}

async function CategoryContent({ params }: Pick<PageProps<"/shop/[category]">, "params">) {
  const category = await getCategoryBySlug((await params).category)
  if (!category) notFound()
  return <ShopView category={category} />
}

export default function CategoryPage(props: PageProps<"/shop/[category]">) {
  return (
    <Suspense fallback={<ShopSkeleton />}>
      <CategoryContent params={props.params} />
    </Suspense>
  )
}
