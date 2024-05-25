"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useSearch } from "@/features/search/search-provider"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const ShowResultsButton = () => {
  const { results, isSearching } = useSearch()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  if (pathname === "/search/results") {
    return (
      <Link
        href={{
          pathname: "/search",
          search: new URLSearchParams(searchParams).toString(),
        }}
        className="sticky bottom-20 right-2 float-end ml-auto w-max"
      >
        <Button className={cn("flex gap-2")} variant={"outline"} size={"lg"} onClick={() => router.back()}>
          <span>Back</span>
        </Button>
      </Link>
    )
  }

  return (
    <Link
      href={{
        pathname: "/search/results",
        search: new URLSearchParams(searchParams).toString(),
      }}
      className="sticky bottom-20 right-2 float-end ml-auto w-max"
    >
      <Button
        className={cn("flex gap-2", !isSearching && "animate-buttonheartbeat")}
        variant={"outline"}
        size={"lg"}
        // onClick={() => pushModal("SearchResultsDrawer", { results })}
      >
        <span>Show results</span>
        <Badge className="w-[44px] justify-center">{results.length}</Badge>
      </Button>
    </Link>
  )
}
