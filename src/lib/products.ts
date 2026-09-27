import "server-only"
import { cacheLife, cacheTag } from "next/cache"
import { ObjectId, type WithId } from "mongodb"
import { products, type ProductDoc } from "@/lib/mongodb"
import { categorySlug, type SizeUnit } from "@/lib/store"

// Every read below is cached until an admin changes a product
// (see `updateTag(PRODUCTS_TAG)` in src/app/admin/actions.ts).
export const PRODUCTS_TAG = "products"

function cached() {
  cacheTag(PRODUCTS_TAG)
  cacheLife("max")
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url: string | null
  image_public_id: string | null
  sizes: string[]
  size_unit: SizeUnit
  in_stock: boolean
  created_at: string
}

function toProduct(doc: WithId<ProductDoc>): Product {
  return {
    id: doc._id.toHexString(),
    name: doc.name,
    description: doc.description,
    price: doc.price,
    category: doc.category,
    image_url: doc.image_url,
    image_public_id: doc.image_public_id,
    sizes: doc.sizes ?? [],
    size_unit: doc.size_unit ?? "bangle",
    in_stock: doc.in_stock,
    created_at: doc.created_at.toISOString(),
  }
}

export async function getProducts(opts: { category?: string; limit?: number } = {}) {
  "use cache"
  cached()
  const cursor = products()
    .find(opts.category ? { category: opts.category } : {})
    .sort({ created_at: -1 })
  if (opts.limit) cursor.limit(opts.limit)
  const docs = await cursor.toArray()
  return docs.map(toProduct)
}

export async function getProduct(id: string) {
  "use cache"
  cached()
  if (!ObjectId.isValid(id)) return null
  const doc = await products().findOne({ _id: new ObjectId(id) })
  return doc ? toProduct(doc) : null
}

export async function getProductIds() {
  "use cache"
  cached()
  const docs = await products().find({}, { projection: { _id: 1 } }).toArray()
  return docs.map((d) => d._id.toHexString())
}

export async function getCategories() {
  "use cache"
  cached()
  const categories = await products().distinct("category")
  return categories.filter(Boolean).sort((a, b) => a.localeCompare(b))
}

/** "thread-silk" → "Thread & Silk", or null if no category has that slug. */
export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories()
  return categories.find((c) => categorySlug(c) === slug) ?? null
}

/** One entry per category with a product count and a cover image (newest photo in it). */
export async function getCategorySummaries() {
  "use cache"
  cached()
  const rows = await products()
    .aggregate<{ _id: string; count: number; image: string | null }>([
      { $match: { category: { $nin: ["", null] } } },
      { $sort: { created_at: -1 } },
      { $group: { _id: "$category", count: { $sum: 1 }, image: { $first: "$image_url" } } },
      { $sort: { _id: 1 } },
    ])
    .toArray()
  return rows.map((r) => ({ name: r._id, count: r.count, image: r.image }))
}
