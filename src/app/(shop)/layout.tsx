import Link from "next/link"
import { cacheLife } from "next/cache"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { buttonVariants } from "@/components/ui/button"
import { getSettings } from "@/lib/settings"
import { whatsappChatLink, whatsappGreeting } from "@/lib/store"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/#categories", label: "Collections" },
  { href: "/#size-guide", label: "Size guide" },
  { href: "/#faq", label: "FAQ" },
]

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const { name, tagline, whatsapp } = await getSettings()
  const chatHref = whatsapp ? whatsappChatLink(whatsapp, whatsappGreeting(name)) : null

  return (
    <>
      <div className="bg-primary px-4 py-2 text-center text-xs font-medium tracking-wide text-primary-foreground">
        Order in one tap on WhatsApp — no sign-up needed
      </div>
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="font-heading text-2xl tracking-tight">
            {name}
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="transition hover:text-foreground">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/shop" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "md:hidden")}>
              Shop
            </Link>
            {chatHref && (
              <a
                href={chatHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <WhatsAppIcon className="size-4 text-[#25D366]" />
                <span className="hidden sm:inline">Chat with us</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-16 bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
          <div className="max-w-sm space-y-3">
            <p className="font-heading text-2xl">{name}</p>
            <p className="text-sm text-primary-foreground/70">{tagline}</p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-semibold">Explore</p>
            <ul className="space-y-2 text-primary-foreground/70">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-primary-foreground">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3 text-sm">
            <p className="font-semibold">Contact</p>
            {chatHref ? (
              <a
                href={chatHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground"
              >
                <WhatsAppIcon className="size-4" /> +{whatsapp}
              </a>
            ) : (
              <p className="text-primary-foreground/70">WhatsApp orders only</p>
            )}
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 py-6 text-center text-xs text-primary-foreground/50">
          © <CurrentYear /> {name}. All rights reserved.
        </div>
      </footer>
    </>
  )
}

// Cached so the footer can be prerendered (reading the clock during prerender isn't allowed).
async function CurrentYear() {
  "use cache"
  cacheLife("days")
  return new Date().getFullYear()
}
