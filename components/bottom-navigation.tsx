"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, useMotionValueEvent, useScroll } from "framer-motion"

import { useNavigation } from "@/lib/navigation-provider"
import { Icons } from "@/components/ui/icons/icons"

export default function BottomNavigation() {
  const { activeTab } = useNavigation()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)

  // https://www.youtube.com/watch?v=qc2kQcicNNc
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    if (latest > previous && latest > 100) {
      setHidden(true)
    } else {
      setHidden(false)
    }
  })

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ ease: "easeInOut", duration: 0.35 }}
      className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white"
    >
      <div className="mx-auto flex h-full max-w-md grid-cols-2 justify-center px-3">
        <Link href="/" className="group inline-flex max-w-40 flex-1 flex-col items-center justify-center px-5">
          {activeTab === "home" ? <Icons.homeActive /> : <Icons.home />}
          <span className="text-sm font-medium">Home</span>
        </Link>
        <Link href="/search" className="group inline-flex max-w-40 flex-1 flex-col items-center justify-center px-5">
          {activeTab === "search" ? <Icons.searchActive /> : <Icons.search />}
          <span className="text-sm font-medium">Search</span>
        </Link>
        <Link href="/account" className="group inline-flex max-w-40 flex-1 flex-col items-center justify-center px-5">
          {activeTab === "account" ? <Icons.accountActive /> : <Icons.account />}
          <span className="text-sm font-medium">Account</span>
        </Link>
      </div>
    </motion.nav>
  )
}
