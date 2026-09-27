import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-heading text-3xl">Product not found</h1>
      <p className="mt-2 text-muted-foreground">It may have been removed.</p>
      <Link href="/" className={buttonVariants({ className: "mt-6" })}>
        Back to shop
      </Link>
    </div>
  )
}
