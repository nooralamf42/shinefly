# Sweet Shop

A simple Next.js store. You list products from an admin panel, and customers order by tapping **Buy on WhatsApp**. That opens WhatsApp with the product, quantity and total already filled in, so there's no payment gateway.

- **Storefront:** `/`, with category filters and a page for each product
- **Admin panel:** `/admin`. You log in with the email and password set in your env vars. There you can add, edit and delete products, upload photos, and mark items in or out of stock.

Everything below runs on free tiers.

| What | Service |
|---|---|
| Products database | MongoDB Atlas (M0 free cluster) |
| Product photos | Cloudinary (free plan) |
| Hosting | Vercel (Hobby plan) |

## Setup

### 1. MongoDB Atlas
1. Sign up at https://www.mongodb.com/cloud/atlas/register and create a **free M0** cluster.
2. Go to **Database Access**, add a database user, and save the username and password.
3. Go to **Network Access**, click **Add IP Address**, and choose **Allow access from anywhere** (`0.0.0.0/0`). Vercel doesn't use fixed IPs, so this is required.
4. Click **Connect** → **Drivers** and copy the connection string. Put your user's password into it.

### 2. Cloudinary
1. Sign up at https://cloudinary.com (free).
2. Go to **Dashboard** → **API Keys** and copy the **Cloud name**, **API key** and **API secret**.

### 3. Environment variables
Copy `.env.example` to `.env.local` and fill it in:

- the MongoDB and Cloudinary values from steps 1 and 2
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: your admin login
- `AUTH_SECRET`: a random string of 32 or more characters. You can generate one with:
  `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `NEXT_PUBLIC_CURRENCY` and `NEXT_PUBLIC_LOCALE` (for example `INR` and `en-IN`)

### 4. Run it
```bash
npm install
npm run dev
```
Open http://localhost:3000/admin and log in. Under **Settings**, set your store name, tagline and WhatsApp number (with country code). Then add your first product.

### 5. Deploy (Vercel)
1. Push this folder to a GitHub repo.
2. At https://vercel.com/new, import the repo.
3. Add the same environment variables from `.env.local`, then deploy.

## Demo products
```bash
npm run seed            # add 12 demo bangle products (photos from Unsplash)
npm run seed -- --clear # remove only the demo products
```
Demo products are tagged in the database, so these commands never touch products you add yourself.

## Sizes
Each product has a **size unit** (Bangle size, inches, cm, mm, or Free size) and a comma-separated list of sizes, for example `2.2, 2.4, 2.6, 2.8`. When a product has more than one size, customers must pick one before ordering, and the chosen size is included in the WhatsApp message.

## Editing homepage text
All homepage copy lives in `src/lib/content.ts`: the hero, highlights, ordering steps, story, size chart and FAQ.

## Speed and caching
The storefront is pre-built into static pages (Next.js Cache Components), and database reads are cached, so pages load in a few milliseconds.

- Any change you make in the **admin panel** (products, stock, settings) refreshes the affected pages right away.
- Changes made **outside the admin panel**, like `npm run seed` or editing MongoDB directly, show up after the next deploy or within a day. To see them immediately in local production mode, rebuild with `npm run build`. In `npm run dev` they appear on refresh.

## Notes
- Atlas only pauses a free cluster after **60 days with no connections**. Every visit to the site counts as a connection, so a live store won't hit that.
- Product photos must be under 3.5 MB.
