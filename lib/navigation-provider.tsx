"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

type ActiveTab = "home" | "search" | "account" | null

interface INavigationContext {
  activeTab: ActiveTab
}

const NavigationContext = createContext({} as INavigationContext)

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return useContext(NavigationContext)
}

function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<ActiveTab>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("home")
    } else if (pathname.startsWith("/search")) {
      setActiveTab("search")
    } else if (pathname.startsWith("/account")) {
      setActiveTab("account")
    }
  }, [pathname])

  return (
    <NavigationContext.Provider
      value={{
        activeTab,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationProvider
