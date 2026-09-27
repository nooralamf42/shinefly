import "server-only"
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary"

let configured = false

function cld() {
  if (!configured) {
    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new Error(
        "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET. Copy .env.example to .env.local and fill it in."
      )
    }
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
      secure: true,
    })
    configured = true
  }
  return cloudinary
}

export async function uploadImage(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer())
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cld()
      .uploader.upload_stream({ folder: "products", resource_type: "image" }, (error, res) => {
        if (error || !res) reject(error ?? new Error("Upload failed"))
        else resolve(res)
      })
      .end(buffer)
  })
  return { url: result.secure_url, publicId: result.public_id }
}

export async function deleteImage(publicId: string | null | undefined) {
  if (!publicId) return
  try {
    await cld().uploader.destroy(publicId)
  } catch {
    // A leftover image in Cloudinary isn't worth failing the request over.
  }
}
