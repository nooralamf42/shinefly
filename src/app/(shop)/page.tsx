import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Gem, HeartHandshake, Ruler } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { content } from "@/lib/content"
import { getCategorySummaries, getProducts } from "@/lib/products"
import { getSettings } from "@/lib/settings"
import { categorySlug, whatsappChatLink, whatsappGreeting } from "@/lib/store"
import { cn } from "@/lib/utils"

const highlightIcons = [Ruler, Gem, WhatsAppIcon, HeartHandshake]

export default async function HomePage() {
  const [latest, categories, { name, whatsapp }] = await Promise.all([
    getProducts({ limit: 8 }),
    getCategorySummaries(),
    getSettings(),
  ])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20 lg:gap-16">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{content.hero.eyebrow}</p>
            <h1 className="font-heading text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">{content.hero.title}</h1>
            <p className="max-w-lg text-lg text-muted-foreground">{content.hero.body}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}>
                Shop the collection <ArrowRight />
              </Link>
              <Link
                href="#how-to-order"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-6 text-base")}
              >
                How ordering works
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-square lg:aspect-[4/5]">
            <Image
              src={content.hero.image}
              alt={content.hero.imageAlt}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[80%_center]"
            />
          </div>
        </div>
      </section>

      {/* ── Highlights ───────────────────────────────────────── */}
      <section className="border-b">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
          {content.highlights.map((h, i) => {
            const Icon = highlightIcons[i % highlightIcons.length]
            return (
              <div key={h.title} className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-soft text-foreground">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{h.title}</p>
                  <p className="text-sm text-muted-foreground">{h.body}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      {categories.length > 0 && (
        <section id="categories" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-16 sm:px-6">
          <SectionHeading eyebrow="Collections" title="Shop by style" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.name}
                href={`/shop/${categorySlug(c.name)}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-muted"
              >
                {c.image && (
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-heading text-xl">{c.name}</p>
                  <p className="text-xs text-white/80">
                    {c.count} {c.count === 1 ? "design" : "designs"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── New arrivals ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        <SectionHeading
          eyebrow="Just in"
          title="New arrivals"
          action={
            <Link href="/shop" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline">
              View all <ArrowRight className="size-4" />
            </Link>
          }
        />
        {latest.length === 0 ? (
          <p className="rounded-xl border border-dashed py-16 text-center text-muted-foreground">
            New designs are on the way — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {latest.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ── Story ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="grid overflow-hidden rounded-2xl bg-primary text-primary-foreground md:grid-cols-2">
          <div className="relative min-h-72">
            <Image
              src={content.story.image}
              alt={content.story.imageAlt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-5 p-8 sm:p-12">
            <h2 className="font-heading text-3xl sm:text-4xl">{content.story.title}</h2>
            <p className="text-primary-foreground/75">{content.story.body}</p>
            <Link
              href="/shop"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "h-11 w-fit px-5"
              )}
            >
              Explore designs <ArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How to order ─────────────────────────────────────── */}
      <section id="how-to-order" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-20 sm:px-6">
        <SectionHeading eyebrow="Simple & secure" title="How ordering works" center />
        <ol className="grid gap-6 md:grid-cols-3">
          {content.steps.map((s, i) => (
            <li key={s.title} className="rounded-xl border bg-card p-6">
              <span className="font-heading text-4xl text-gold">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Size guide + FAQ ─────────────────────────────────── */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 pt-20 sm:px-6 lg:grid-cols-2">
        <div id="size-guide" className="scroll-mt-20">
          <SectionHeading eyebrow="Find your fit" title="Bangle size guide" />
          <p className="mb-6 text-sm text-muted-foreground">{content.sizeGuide.intro}</p>
          <div className="overflow-hidden rounded-xl border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Bangle size</th>
                  <th className="px-4 py-3 font-semibold">Inner diameter</th>
                  <th className="px-4 py-3 font-semibold">Millimetres</th>
                </tr>
              </thead>
              <tbody>
                {content.sizeGuide.rows.map((r) => (
                  <tr key={r.size} className="border-t">
                    <td className="px-4 py-3 font-semibold">{r.size}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.inches}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.mm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div id="faq" className="scroll-mt-20">
          <SectionHeading eyebrow="Good to know" title="Questions & answers" />
          <div className="divide-y rounded-xl border bg-card">
            {content.faq.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                  {f.q}
                  <span className="text-xl leading-none text-muted-foreground transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── WhatsApp CTA ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6">
        <div className="flex flex-col items-center gap-5 rounded-2xl bg-gold-soft px-6 py-14 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl">Need help choosing?</h2>
          <p className="max-w-md text-muted-foreground">
            Send us a photo of your outfit or ask about sizes — the {name} team replies on WhatsApp.
          </p>
          {whatsapp ? (
            <a
              href={whatsappChatLink(whatsapp, whatsappGreeting(name))}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 bg-[#25D366] px-6 text-base text-white hover:bg-[#1fb857]"
              )}
            >
              <WhatsAppIcon className="size-5" /> Chat on WhatsApp
            </a>
          ) : (
            <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base")}>
              Browse the collection
            </Link>
          )}
        </div>
      </section>
    </>
  )
}

function SectionHeading({
  eyebrow,
  title,
  action,
  center,
}: {
  eyebrow: string
  title: string
  action?: React.ReactNode
  center?: boolean
}) {
  return (
    <div className={cn("mb-8 flex items-end justify-between gap-4", center && "justify-center text-center")}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
        <h2 className="mt-2 font-heading text-3xl sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  )
}
