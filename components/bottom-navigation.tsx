import Link from "next/link"

import { Icons } from "@/components/ui/icons"

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white">
      <div className="mx-auto grid h-full max-w-lg grid-cols-2">
        <Link href="/" className="group inline-flex flex-col items-center justify-center px-5">
          <Icons.home />
          <span className="text-sm">Home</span>
        </Link>
        <Link href="/account" className="group inline-flex flex-col items-center justify-center px-5">
          <Icons.account />
          <span className="text-sm">Account</span>
        </Link>
      </div>
    </div>
  )
}
