"use client"

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"
import { ImageIcon, X } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import type { FormState } from "@/app/admin/actions"
import type { Product } from "@/lib/products"
import { SIZE_UNITS, formatSize, type SizeUnit } from "@/lib/store"

const MAX_IMAGE_MB = 3.5

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  product?: Product
  categories: string[]
}

export function ProductForm({ action, product, categories }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const [inStock, setInStock] = useState(product?.in_stock ?? true)
  const [preview, setPreview] = useState<string | null>(product?.image_url ?? null)
  const [removeImage, setRemoveImage] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>(product?.size_unit ?? "bangle")
  const [sizesText, setSizesText] = useState(product?.sizes.join(", ") ?? "")
  const parsedSizes = [...new Set(sizesText.split(",").map((s) => s.trim()).filter(Boolean))]

  // Free object URLs created for local previews.
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setFileError(null)
    if (!file) return
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setFileError(`That photo is too big — please use one under ${MAX_IMAGE_MB} MB.`)
      e.target.value = ""
      return
    }
    setRemoveImage(false)
    setPreview(URL.createObjectURL(file))
  }

  function clearImage() {
    setPreview(null)
    setRemoveImage(true)
    const input = document.getElementById("image") as HTMLInputElement | null
    if (input) input.value = ""
  }

  return (
    <form action={formAction} className="grid gap-6 md:grid-cols-[240px_1fr]">
      <div className="space-y-2">
        <Label htmlFor="image">Photo</Label>
        <label
          htmlFor="image"
          className="relative grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-2xl border-2 border-dashed bg-muted text-center text-sm text-muted-foreground transition hover:border-primary/50"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob previews
            <img src={preview} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-2 p-4">
              <ImageIcon className="size-8" />
              Click to upload
            </span>
          )}
        </label>
        <input id="image" name="image" type="file" accept="image/*" className="sr-only" onChange={onFileChange} />
        <input type="hidden" name="remove_image" value={removeImage ? "on" : ""} />
        {preview && (
          <Button type="button" variant="ghost" size="sm" onClick={clearImage}>
            <X /> Remove photo
          </Button>
        )}
        {fileError && <p className="text-sm text-destructive">{fileError}</p>}
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={product?.name} required maxLength={120} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              defaultValue={product?.price}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              list="category-options"
              placeholder="e.g. Gold Plated"
              defaultValue={product?.category}
              maxLength={60}
            />
            <datalist id="category-options">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
        </div>

        <fieldset className="space-y-4 rounded-xl border p-4">
          <legend className="px-1 text-sm font-semibold">Sizes</legend>
          <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
            <div className="space-y-2">
              <Label htmlFor="size_unit">Size unit</Label>
              <select
                id="size_unit"
                name="size_unit"
                value={sizeUnit}
                onChange={(e) => setSizeUnit(e.target.value as SizeUnit)}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {SIZE_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>
            {sizeUnit !== "free" && (
              <div className="space-y-2">
                <Label htmlFor="sizes">Available sizes</Label>
                <Input
                  id="sizes"
                  name="sizes"
                  value={sizesText}
                  onChange={(e) => setSizesText(e.target.value)}
                  placeholder={sizeUnit === "bangle" ? "2.2, 2.4, 2.6, 2.8" : "5.5, 6, 6.5"}
                />
                <p className="text-xs text-muted-foreground">Separate with commas. Leave empty if there&apos;s only one size.</p>
              </div>
            )}
          </div>
          {sizeUnit !== "free" && parsedSizes.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {parsedSizes.map((s) => (
                <span key={s} className="rounded-md border bg-muted px-2 py-0.5 text-xs font-semibold">
                  {formatSize(s, sizeUnit)}
                </span>
              ))}
            </div>
          )}
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={6} defaultValue={product?.description} />
        </div>

        <div className="flex items-center gap-3">
          <Switch id="in_stock" checked={inStock} onCheckedChange={setInStock} />
          <input type="hidden" name="in_stock" value={inStock ? "on" : ""} />
          <Label htmlFor="in_stock">In stock</Label>
        </div>

        {state?.error && <p className="text-sm font-medium text-destructive">{state.error}</p>}

        <div className="flex gap-2">
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? "Saving…" : product ? "Save changes" : "Add product"}
          </Button>
          <Link href="/admin" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Cancel
          </Link>
        </div>
      </div>
    </form>
  )
}
