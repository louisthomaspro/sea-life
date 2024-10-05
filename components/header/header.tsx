import Link from "next/link"

import { Icons } from "@/components/ui/icons/icons"
import UserProfile from "@/components/header/user-profile"

export default function Header() {
  return (
    <header className="border-b-0 py-4 lg:border-b">
      <div className="container flex items-center justify-between">
        <Link href="/">
          <Icons.logoWithText className="hidden h-8 w-auto lg:block" />
          <Icons.logo className="h-8 w-auto lg:hidden" />
        </Link>
        {/* <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Icons.bars className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <nav className="mt-8 flex flex-col space-y-4">
              <SheetClose asChild>
                <a href="#" className="text-lg hover:text-primary">
                  Home
                </a>
              </SheetClose>
              <SheetClose asChild>
                <a href="#" className="text-lg hover:text-primary">
                  Discover
                </a>
              </SheetClose>
              <SheetClose asChild>
                <a href="#" className="text-lg hover:text-primary">
                  About
                </a>
              </SheetClose>
              <SheetClose asChild>
                <a href="#" className="text-lg hover:text-primary">
                  Contact
                </a>
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
        <nav className="hidden space-x-6 lg:flex">
          <a href="#" className="text-gray-600 hover:text-primary">
            Home
          </a>
          <a href="#" className="text-gray-600 hover:text-primary">
            Discover
          </a>
          <a href="#" className="text-gray-600 hover:text-primary">
            About
          </a>
          <a href="#" className="text-gray-600 hover:text-primary">
            Contact
          </a>
        </nav> */}
        <UserProfile />
      </div>
    </header>
  )
}
