import type { Metadata } from "next"
import { ShopView } from "@/components/shop-view"

export const metadata: Metadata = { title: "Shop all bangles" }

export default function ShopPage() {
  return <ShopView />
}
