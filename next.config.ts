import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Prerender the storefront into static pages and cache database reads with "use cache".
  // Admin changes refresh the cache instantly via updateTag() in src/app/admin/actions.ts.
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      new URL("https://res.cloudinary.com/**"),
      // Demo product photos (Unsplash License). Unsplash resizes via query params.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  experimental: {
    serverActions: {
      // Product photo uploads go through a server action. Vercel caps request bodies at 4.5MB.
      bodySizeLimit: "4mb",
    },
  },
}

export default nextConfig
