"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { popAllModals } from "@/lib/pushmodal/pushmodal"

export const ModalProviderNavigationAutoClose = () => {
  const pathname = usePathname()

  useEffect(() => {
    popAllModals()
  }, [pathname])

  return null
}
