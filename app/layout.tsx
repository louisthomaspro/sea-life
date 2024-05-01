import "./globals.css"

import NextTopLoader from "nextjs-toploader"

import { fontSans } from "@/lib/font"
import { cn } from "@/lib/utils"
import BottomNavigation from "@/components/bottom-navigation"
import { TailwindIndicator } from "@/components/tailwind-indicator"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("mx-auto max-w-md pb-16 font-sans", fontSans.variable)} suppressHydrationWarning>
        {children}
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
      </body>
    </html>
  )
}
