import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { TranslationProvider } from "../lib/i18n/context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Save Life - Blood Donation System",
  description: "Connecting blood donors with hospitals in need",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TranslationProvider>{children}</TranslationProvider>
      </body>
    </html>
  )
}
