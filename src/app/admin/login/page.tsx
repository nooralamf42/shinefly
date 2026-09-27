import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/admin/login-form"
import { isAdmin } from "@/lib/auth"

export const metadata: Metadata = { title: "Admin login", robots: { index: false } }

export const instant = false

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin")

  return (
    <main className="grid flex-1 place-items-center bg-gradient-to-b from-secondary to-background px-4 py-16">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl font-extrabold">Admin login</CardTitle>
          <CardDescription>Sign in to manage your products.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </main>
  )
}
