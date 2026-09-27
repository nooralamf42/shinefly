"use server"

import { ObjectId } from "mongodb"
import { updateTag } from "next/cache"
import { redirect } from "next/navigation"
import { checkCredentials, createSession, deleteSession, requireAdmin } from "@/lib/auth"
import { deleteImage, uploadImage } from "@/lib/cloudinary"
import { products, settings } from "@/lib/mongodb"
import { PRODUCTS_TAG } from "@/lib/products"
import { SETTINGS_TAG } from "@/lib/settings"
import { isSizeUnit, normalizeWhatsapp, type SizeUnit } from "@/lib/store"

export type FormState = { error?: string } | undefined

// ── Auth ────────────────────────────────────────────────────────────

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  if (!checkCredentials(email, password)) {
    return { error: "Wrong email or password." }
  }
  await createSession()
  redirect("/admin")
}

export async function logout() {
  await deleteSession()
  redirect("/admin/login")
}

// ── Products ────────────────────────────────────────────────────────

const MAX_IMAGE_BYTES = 3.5 * 1024 * 1024

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const price = Number(formData.get("price"))
  const in_stock = formData.get("in_stock") === "on"
  const unitRaw = formData.get("size_unit")
  const size_unit: SizeUnit = isSizeUnit(unitRaw) ? unitRaw : "bangle"
  // "2.2, 2.4 ,2.6" → ["2.2", "2.4", "2.6"], de-duplicated, order kept.
  const sizes =
    size_unit === "free"
      ? []
      : [...new Set(String(formData.get("sizes") ?? "").split(",").map((s) => s.trim()).filter(Boolean))]

  if (!name) return { error: "Please give the product a name." }
  if (!Number.isFinite(price) || price < 0) return { error: "Please enter a valid price." }
  if (sizes.some((s) => s.length > 12)) return { error: "Each size should be short, like 2.4 or 6.5." }
  return { fields: { name, description, category, price, in_stock, sizes, size_unit } }
}

type ImageResult = { error?: string; url: string | null; publicId: string | null }

async function readImage(file: FormDataEntryValue | null): Promise<ImageResult> {
  const none = { url: null, publicId: null }
  if (!(file instanceof File) || file.size === 0) return none
  if (!file.type.startsWith("image/")) return { ...none, error: "The photo must be an image file." }
  if (file.size > MAX_IMAGE_BYTES) return { ...none, error: "The photo is too big (max 3.5 MB)." }
  try {
    return await uploadImage(file)
  } catch (e) {
    return { ...none, error: `Image upload failed: ${e instanceof Error ? e.message : "unknown error"}` }
  }
}

function toObjectId(id: string) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null
}

/** Expire every cached product read so the storefront shows the change on the next request. */
function refreshShop() {
  updateTag(PRODUCTS_TAG)
}

export async function createProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const parsed = readProductFields(formData)
  if (parsed.error) return { error: parsed.error }

  const image = await readImage(formData.get("image"))
  if (image.error) return { error: image.error }

  try {
    await products().insertOne({
      _id: new ObjectId(),
      ...parsed.fields!,
      image_url: image.url,
      image_public_id: image.publicId,
      created_at: new Date(),
    })
  } catch (e) {
    await deleteImage(image.publicId)
    return { error: e instanceof Error ? e.message : "Could not save the product." }
  }

  refreshShop()
  redirect("/admin")
}

export async function updateProduct(
  id: string,
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  await requireAdmin()
  const _id = toObjectId(id)
  const parsed = readProductFields(formData)
  if (parsed.error) return { error: parsed.error }

  const existing = _id ? await products().findOne({ _id }) : null
  if (!_id || !existing) return { error: "This product no longer exists." }

  const image = await readImage(formData.get("image"))
  if (image.error) return { error: image.error }
  const removeCurrent = formData.get("remove_image") === "on"

  let image_url = existing.image_url
  let image_public_id = existing.image_public_id
  if (image.url) {
    image_url = image.url
    image_public_id = image.publicId
  } else if (removeCurrent) {
    image_url = null
    image_public_id = null
  }

  try {
    await products().updateOne({ _id }, { $set: { ...parsed.fields!, image_url, image_public_id } })
  } catch (e) {
    await deleteImage(image.publicId)
    return { error: e instanceof Error ? e.message : "Could not save the product." }
  }
  if (image_public_id !== existing.image_public_id) await deleteImage(existing.image_public_id)

  refreshShop()
  redirect("/admin")
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  const _id = toObjectId(id)
  if (!_id) return
  const deleted = await products().findOneAndDelete({ _id })
  await deleteImage(deleted?.image_public_id)
  refreshShop()
}

// ── Settings ────────────────────────────────────────────────────────

export type SettingsState = { error?: string; saved?: boolean } | undefined

export async function saveSettings(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  await requireAdmin()
  const name = String(formData.get("name") ?? "").trim()
  const tagline = String(formData.get("tagline") ?? "").trim()
  const whatsapp = normalizeWhatsapp(String(formData.get("whatsapp") ?? ""))

  if (!name) return { error: "Please enter a store name." }
  if (name.length > 60) return { error: "Store name should be 60 characters or less." }
  if (tagline.length > 160) return { error: "Tagline should be 160 characters or less." }
  // An empty number is allowed — the Buy button simply stays off until one is added.
  if (whatsapp && whatsapp.startsWith("0")) {
    return { error: "Start the WhatsApp number with your country code instead of 0 — e.g. 91 for India, 92 for Pakistan." }
  }
  if (whatsapp && (whatsapp.length < 8 || whatsapp.length > 15)) {
    return { error: "That WhatsApp number doesn't look like a full phone number with country code." }
  }

  await settings().updateOne(
    { _id: "store" },
    { $set: { name, tagline, whatsapp, updated_at: new Date() } },
    { upsert: true }
  )
  updateTag(SETTINGS_TAG)
  return { saved: true }
}

export async function setInStock(id: string, in_stock: boolean) {
  await requireAdmin()
  const _id = toObjectId(id)
  if (!_id) return
  await products().updateOne({ _id }, { $set: { in_stock } })
  refreshShop()
}
