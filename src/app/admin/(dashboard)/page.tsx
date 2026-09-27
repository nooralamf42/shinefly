import Image from "next/image"
import Link from "next/link"
import { ImageIcon, Pencil, Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DeleteProductButton, StockSwitch } from "@/components/admin/product-row-actions"
import { requireAdmin } from "@/lib/auth"
import { getProducts } from "@/lib/products"
import { getSettings } from "@/lib/settings"
import { formatPrice, formatSize } from "@/lib/store"

export default async function AdminProductsPage() {
  await requireAdmin()
  const [products, { whatsapp }] = await Promise.all([getProducts(), getSettings()])

  return (
    <div className="space-y-6">
      {!whatsapp && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <span>
            <strong>Add your WhatsApp number</strong> — customers can&apos;t place orders until it&apos;s set.
          </span>
          <Link href="/admin/settings" className={buttonVariants({ size: "sm" })}>
            Open settings
          </Link>
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Products</h1>
          <p className="text-sm text-muted-foreground">{products.length} total</p>
        </div>
        <Link href="/admin/products/new" className={buttonVariants({ size: "lg" })}>
          <Plus /> Add product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center text-muted-foreground">
          No products yet. Click <strong>Add product</strong> to list your first one.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16" />
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>In stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="relative size-12 overflow-hidden rounded-lg bg-muted">
                      {p.image_url ? (
                        <Image src={p.image_url} alt="" fill sizes="48px" className="object-cover" />
                      ) : (
                        <ImageIcon className="m-auto mt-3.5 size-5 text-muted-foreground/50" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {[p.category, p.size_unit === "free" ? "Free size" : p.sizes.map((sz) => formatSize(sz, p.size_unit)).join(" · ")]
                        .filter(Boolean)
                        .join(" — ")}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">{formatPrice(p.price)}</TableCell>
                  <TableCell>
                    <StockSwitch id={p.id} inStock={p.in_stock} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className={buttonVariants({ variant: "ghost", size: "icon" })}
                      aria-label={`Edit ${p.name}`}
                    >
                      <Pencil />
                    </Link>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
