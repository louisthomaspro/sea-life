import "./globals.css"

import type { Metadata, Viewport } from "next"
import NextTopLoader from "nextjs-toploader"

import { fontSans } from "@/lib/font"
import { Providers } from "@/lib/providers"
import { cn } from "@/lib/utils"
import BottomNavigation from "@/components/bottom-navigation"
import { TailwindIndicator } from "@/components/tailwind-indicator"

export const metadata: Metadata = {
  manifest: "/manifest.json",
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("h-dvh pb-16 font-sans", fontSans.variable)} suppressHydrationWarning>
        <Providers>
          <div className="mx-auto max-w-md">{children}</div>
          <BottomNavigation />
          <TailwindIndicator />
          <NextTopLoader
            color="#2299DD"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          />
        </Providers>
      </body>
    </html>
  )
}
