"use client"

import { useState } from "react"
import Link from "next/link"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useDebounce } from "use-debounce"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogTrigger } from "@/components/ui/dialog"
import { DialogSearchContent } from "@/components/ui/dialog-search"
import { Icons } from "@/components/ui/icons/icons"
import ImageLoader from "@/components/ui/image-loader"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import AdvancedSearchButton from "@/components/advanced-search-button/advanced-search-button"
import { SearchResult } from "@/app/api/search/route"

interface SearchInputProps extends React.HTMLProps<HTMLInputElement> {}

export const SearchInput = ({ className, ...props }: SearchInputProps) => {
  const [term, setTerm] = useState("")

  const debouncedSearchQuery = useDebounce(term.trim(), 200)
  const { data: speciesResults, isFetching } = useQuery<SearchResult[]>({
    queryKey: ["search", ...debouncedSearchQuery],
    queryFn: async () => {
      const data = await fetch(`/api/search?term=${term}`).then((res) => res.json())
      return data
    },
    enabled: !!term,
    placeholderData: keepPreviousData,
  })

  return (
    <div className="relative flex max-w-sm grow flex-col gap-4" {...props}>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex w-full items-center">
            <Input
              placeholder="Search for species"
              className="h-12 border-none bg-neutral-50 pl-11 focus-visible:ring-0"
            />
            <Icons.search className="absolute left-4 size-5 text-gray-400" />
          </div>
        </DialogTrigger>
        <DialogSearchContent className="flex w-full flex-col overflow-auto">
          <div className="relative w-full py-3 shadow-md">
            <div className="container flex max-w-lg items-center gap-2">
              <div className="relative flex w-full grow items-center">
                <Input
                  placeholder="Search for species"
                  autoFocus
                  value={term}
                  className="h-12 border-none bg-neutral-50 pl-11 focus-visible:ring-0"
                  onChange={(e) => {
                    setTerm(e.target.value)
                  }}
                />

                <Icons.search className="absolute left-4 size-5 text-gray-400" />

                {isFetching && (
                  <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-4">
                    <Icons.spinner className="size-5" />
                  </div>
                )}

                {!isFetching && term && (
                  <div
                    className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-4"
                    onClick={() => {
                      setTerm("")
                    }}
                  >
                    <Icons.close className="size-5" />
                  </div>
                )}
              </div>
              <DialogClose onClick={() => setTerm("")}>
                <Button id="cancel-search" variant="outline" className="whitespace-nowrap">
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </div>
          <div className="container max-w-lg grow overflow-auto py-4">
            {term && speciesResults && speciesResults.length > 0 && (
              <div className={"h-full w-full grow overflow-auto px-2"}>
                <div className="flex flex-col gap-2">
                  {speciesResults.map((species) => (
                    <Link
                      href={`/species/${species.id}`}
                      className="rounded-md border bg-white p-2 shadow transition-colors hover:bg-gray-100"
                    >
                      <div key={species.id} className="flex items-center gap-2.5">
                        <div className="relative size-14 flex-none overflow-hidden rounded-sm bg-gray-200">
                          <ImageLoader
                            key={species.id}
                            src={species.url}
                            alt={species.scientificName}
                            width={40}
                            height={40}
                            className="size-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="overflow-auto">
                            <div className="truncate text-sm font-semibold">{species.commonNames.en?.[0] ?? "-"}</div>
                            <div className="truncate text-sm font-semibold">{species.commonNames.fr?.[0] ?? "-"}</div>
                          </div>
                          <div className="truncate text-xs italic text-gray-500">{species.scientificName}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogSearchContent>
      </Dialog>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>
      <div className="flex justify-center">
        <AdvancedSearchButton />
      </div>
    </div>
  )
}
