import "./advanced-search-button.css"

import Link from "next/link"

import { cn } from "@/lib/utils"

interface AdvancedSearchButtonProps extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> {}

export default function AdvancedSearchButton({ className, ...props }: AdvancedSearchButtonProps) {
  return (
    <Link
      href={"/search"}
      className={cn(
        "academy-fancy-button relative flex h-9 items-center justify-center overflow-hidden px-4 shadow-[0_1px_0px] shadow-orange-400 transition-shadow hover:shadow-none",
        className
      )}
      {...props}
    >
      <div className="mask absolute size-full opacity-10 transition-all hover:opacity-15" />
      {/* <Icons.fancyAcademy className="mr-2 h-4 w-4" /> */}
      <span className="academy-text bg-clip-text text-sm font-semibold text-transparent">Search by criteria</span>
    </Link>
  )
}
