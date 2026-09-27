import type { Metadata } from "next"
import { Manrope, Playfair_Display, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { getSettings } from "@/lib/settings"
import "./globals.css"

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export async function generateMetadata(): Promise<Metadata> {
  const { name, tagline } = await getSettings()
  return {
    title: { default: name, template: `%s · ${name}` },
    description: tagline,
  }
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${playfair.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}
