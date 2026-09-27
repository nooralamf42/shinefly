// Demo bangle products for trying the store out.
//   npm run seed          → (re)insert the demo products
//   npm run seed -- --clear → remove them
// Only touches products marked { demo: true }; your own products are never changed.
// Photos: Unsplash (https://unsplash.com/license), served straight from images.unsplash.com.

import { MongoClient } from "mongodb"

const img = (id) => `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`
const BANGLE = ["2.2", "2.4", "2.6", "2.8"]

const demo = [
  {
    name: "Classic Gold-Plated Bangle Set (6 pcs)",
    category: "Gold Plated",
    price: 1499,
    sizes: [...BANGLE, "2.10"],
    size_unit: "bangle",
    image: "1758995119744-6454f091303f",
    description:
      "Six slim gold-plated bangles with a delicate cut-work pattern. Light enough for daily wear, bright enough for festivals.\n\nFinish: 1-gram gold plating\nSet of 6",
  },
  {
    name: "Twisted Stone-Studded Bangles (Pair)",
    category: "Gold Plated",
    price: 1299,
    sizes: BANGLE,
    size_unit: "bangle",
    image: "1690175867343-2af70ea57537",
    description: "A pair of twisted gold-tone bangles lined with sparkling white stones. Pairs beautifully with sarees and suits alike.",
  },
  {
    name: "Kundan Ruby Bridal Kada",
    category: "Bridal",
    price: 3499,
    sizes: ["2.4", "2.6", "2.8"],
    size_unit: "bangle",
    image: "1611598935678-c88dca238fce",
    description:
      "A statement bridal kada with kundan work and ruby-red centre stones. Made to be the highlight of your wedding look.\n\nSold as a pair.",
  },
  {
    name: "Zircon Studded Bangle Pair",
    category: "Bridal",
    price: 2499,
    sizes: BANGLE,
    size_unit: "bangle",
    image: "1679156271456-d6068c543ee7",
    description: "Gold-tone bangles fully set with shimmering zircon stones. Elegant for receptions, engagements and festive evenings.",
  },
  {
    name: "Two-Tone Twist Bangles",
    category: "Everyday",
    price: 899,
    sizes: ["5.5", "6", "6.5"],
    size_unit: "cm",
    image: "1692249444938-1d39b550a441",
    description: "Gold and silver strands twisted into a modern, minimal bangle. Easy to stack with a watch or wear on its own.",
  },
  {
    name: "Minimal Link Bangle-Bracelet",
    category: "Everyday",
    price: 699,
    sizes: [],
    size_unit: "free",
    image: "1741071520904-37ef3c0fea09",
    description: "A sleek gold-tone link piece with an adjustable clasp — one size fits most wrists. Perfect for work and everyday outfits.",
  },
  {
    name: "Teal Glass Bangle Set (24 pcs)",
    category: "Glass",
    price: 599,
    sizes: BANGLE,
    size_unit: "bangle",
    image: "1723144290967-b9a692207d04",
    description: "Traditional glass bangles in teal, coral and gold with stone accents. A full-hand set of 24 (12 per hand).",
  },
  {
    name: "Pastel Rainbow Glass Bangles",
    category: "Glass",
    price: 549,
    sizes: BANGLE,
    size_unit: "bangle",
    image: "1723144290281-de6d80a79028",
    description: "Soft pastel glass bangles in pink, mint, lilac and blue with glitter detailing. Great for mehndi and haldi functions.",
  },
  {
    name: "Silk Thread Bangles (Set of 12)",
    category: "Thread & Silk",
    price: 449,
    sizes: BANGLE,
    size_unit: "bangle",
    image: "1718878404004-6502a550c23b",
    description: "Hand-wrapped silk thread bangles in bright mixed colours. Lightweight, won't break, and made to be stacked.",
  },
  {
    name: "Metallic Thread Bangle Stack",
    category: "Thread & Silk",
    price: 499,
    sizes: BANGLE,
    size_unit: "bangle",
    image: "1670820285472-15a9b2c79d00",
    description: "Silk-thread bangles finished with metallic gold banding. Mix and match colours to suit any outfit.",
  },
  {
    name: "Hand-Painted Lac Bangles",
    category: "Traditional",
    price: 799,
    sizes: BANGLE,
    size_unit: "bangle",
    image: "1709456533985-254ebb7b00db",
    description: "Artisan lac bangles hand-painted in warm yellows, oranges and reds. A festive classic with a handmade feel.",
  },
  {
    name: "Festive Mixed Bangle Stack",
    category: "Traditional",
    price: 999,
    sizes: BANGLE,
    size_unit: "bangle",
    image: "1648395862836-03514a44400e",
    description: "A ready-to-wear stack of gold, orange and embellished bangles — everything you need for Eid, Diwali or a wedding.",
  },
]

const uri = process.env.MONGODB_URI
if (!uri) {
  console.error("MONGODB_URI is not set. Run with: npm run seed")
  process.exit(1)
}

const client = new MongoClient(uri)
try {
  const col = client.db(process.env.MONGODB_DB || "shop").collection("products")
  const { deletedCount } = await col.deleteMany({ demo: true })
  console.log(`Removed ${deletedCount} existing demo product(s).`)

  if (!process.argv.includes("--clear")) {
    const now = Date.now()
    const docs = demo.map(({ image, ...p }, i) => ({
      ...p,
      image_url: img(image),
      image_public_id: null,
      in_stock: true,
      demo: true,
      // Spread creation times so "New arrivals" has a stable order.
      created_at: new Date(now - i * 60_000),
    }))
    await col.insertMany(docs)
    console.log(`Inserted ${docs.length} demo bangle products.`)
  }
} finally {
  await client.close()
}
