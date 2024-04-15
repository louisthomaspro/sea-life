import "./globals.css"

import { fontSans } from "@/lib/font"
import { cn } from "@/lib/utils"
import BottomNavigation from "@/components/bottom-navigation"
import { TailwindIndicator } from "@/components/tailwind-indicator"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn("pb-16 font-sans", fontSans.variable)} suppressHydrationWarning>
        {children}
        <BottomNavigation />
        <TailwindIndicator />
      </body>
    </html>
  )
}
