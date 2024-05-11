import Link from "next/link"

import { Icons } from "@/components/ui/icons/icons"

export default function BottomNavigation() {
  return (
    <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white">
      <div className="flex h-full max-w-md grid-cols-2 justify-center">
        <Link href="/" className="group inline-flex max-w-40 flex-1 flex-col items-center justify-center px-5">
          <Icons.home />
          <span className="text-sm font-medium">Home</span>
        </Link>
        <Link href="/account" className="group inline-flex max-w-40 flex-1 flex-col items-center justify-center px-5">
          <Icons.account />
          <span className="text-sm font-medium">Account</span>
        </Link>
      </div>
    </div>
  )
}
