import { Inter } from "next/font/google"

import "./globals.css"

import Header from "@/components/header"
import { TailwindIndicator } from "@/components/tailwind-indicator"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <Header />
        {children}
        <TailwindIndicator />
      </body>
    </html>
  )
}
