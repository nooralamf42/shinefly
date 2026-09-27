import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, LogOut, Package, Settings } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { requireAdmin } from "@/lib/auth"
import { getSettings } from "@/lib/settings"
import { logout } from "@/app/admin/actions"

export const metadata: Metadata = { title: "Admin", robots: { index: false } }

// Admin pages read the session cookie on every request, so they render on demand.
export const instant = false

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  const { name } = await getSettings()

  return (
    <>
      <header className="border-b bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
          <Link href="/admin" className="font-extrabold">
            {name} <span className="font-semibold text-muted-foreground">· Admin</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link href="/admin" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              <Package /> <span className="hidden sm:inline">Products</span>
            </Link>
            <Link href="/admin/settings" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              <Settings /> <span className="hidden sm:inline">Settings</span>
            </Link>
            <Link href="/" target="_blank" className={buttonVariants({ variant: "ghost", size: "sm" })}>
              <ExternalLink /> <span className="hidden sm:inline">View store</span>
            </Link>
            <form action={logout}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut /> <span className="hidden sm:inline">Log out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
    </>
  )
}
