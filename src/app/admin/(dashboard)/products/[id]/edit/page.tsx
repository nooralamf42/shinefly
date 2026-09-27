import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"
import { requireAdmin } from "@/lib/auth"
import { getCategories, getProduct } from "@/lib/products"
import { updateProduct } from "@/app/admin/actions"

export default async function EditProductPage(props: PageProps<"/admin/products/[id]/edit">) {
  await requireAdmin()
  const { id } = await props.params
  const [product, categories] = await Promise.all([getProduct(id), getCategories()])
  if (!product) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Edit product</h1>
      <ProductForm action={updateProduct.bind(null, product.id)} product={product} categories={categories} />
    </div>
  )
}
