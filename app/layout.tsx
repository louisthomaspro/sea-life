import "./globals.css"

import type { Metadata, Viewport } from "next"
import NextTopLoader from "nextjs-toploader"

import { fontSans } from "@/lib/font"
import { Providers } from "@/lib/providers"
import { cn } from "@/lib/utils"
import { TailwindIndicator } from "@/components/tailwind-indicator"

export const metadata: Metadata = {
  manifest: "/manifest.json",
  ...(process.env.NODE_ENV === "development"
    ? {
        metadataBase: new URL("http://localhost:3000"),
      }
    : {}),
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("font-sans", fontSans.variable)} suppressHydrationWarning>
        <Providers>
          {children}
          {/* <BottomNavigation /> */}
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
