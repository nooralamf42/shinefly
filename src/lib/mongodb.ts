import "server-only"
import { MongoClient, type ObjectId } from "mongodb"
import type { SizeUnit } from "@/lib/store"

export type ProductDoc = {
  _id: ObjectId
  name: string
  description: string
  price: number
  category: string
  image_url: string | null
  image_public_id: string | null
  sizes?: string[]
  size_unit?: SizeUnit
  in_stock: boolean
  /** Demo products inserted by `npm run seed`. */
  demo?: boolean
  created_at: Date
}

export type SettingsDoc = {
  _id: "store"
  name?: string
  tagline?: string
  /** Digits only, with country code, e.g. 919876543210 */
  whatsapp?: string
  updated_at: Date
}

// Reuse one client across dev hot-reloads and warm serverless invocations.
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient }

function client() {
  if (!globalForMongo.mongoClient) {
    const uri = process.env.MONGODB_URI
    if (!uri) {
      throw new Error("Missing MONGODB_URI. Copy .env.example to .env.local and fill it in.")
    }
    globalForMongo.mongoClient = new MongoClient(uri)
  }
  return globalForMongo.mongoClient
}

function db() {
  return client().db(process.env.MONGODB_DB || "shop")
}

export function products() {
  return db().collection<ProductDoc>("products")
}

export function settings() {
  return db().collection<SettingsDoc>("settings")
}
