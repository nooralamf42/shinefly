import { ProductForm } from "@/components/admin/product-form"
import { requireAdmin } from "@/lib/auth"
import { getCategories } from "@/lib/products"
import { createProduct } from "@/app/admin/actions"

export default async function NewProductPage() {
  await requireAdmin()
  const categories = await getCategories()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Add product</h1>
      <ProductForm action={createProduct} categories={categories} />
    </div>
  )
}
