import Link from "next/link"

import { Icons } from "@/components/ui/icons/icons"
import UserAccount from "@/components/header/user-profile"

export default function Header() {
  return (
    <header className="flex h-16 flex-none items-center shadow-none lg:shadow-sm">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <Icons.logoWithText className="hidden h-8 w-auto lg:block" />
          <Icons.logo className="h-8 w-auto lg:hidden" />
        </Link>
        <UserAccount />
      </div>
    </header>
  )
}
