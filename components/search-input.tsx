"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useDebouncedCallback } from "use-debounce"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/ui/icons"
import ImageLoader from "@/components/ui/image-loader"
import { Input } from "@/components/ui/input"
import { SearchResult } from "@/app/api/search/route"

interface SearchInputProps extends React.HTMLProps<HTMLInputElement> {}

export const SearchInput = ({ className, ...props }: SearchInputProps) => {
  const [term, setTerm] = useState("")
  const [speciesResults, setSpeciesResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const controller = useRef<AbortController>()

  const handleSearch = useDebouncedCallback(async (term) => {
    setIsSearching(true)
    console.log(`Searching... ${term}`)

    controller.current?.abort()
    controller.current = new AbortController()

    if (!term) {
      setSpeciesResults([])
      setIsSearching(false)
      return
    }

    try {
      const data = await fetch(`/api/search?term=${term}`, { signal: controller.current.signal }).then((res) =>
        res.json()
      )

      setSpeciesResults(data)
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error(err)
      }
    }
    setIsSearching(false)
  }, 150)

  return (
    <div className={cn("relative", className)} {...props}>
      <div className="relative">
        <Input
          placeholder="Search for species"
          value={term}
          className="h-12"
          onChange={(e) => {
            setTerm(e.target.value)
            handleSearch(e.target.value)
          }}
        />

        <div
          className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-4"
          onClick={() => {
            setTerm("")
            setSpeciesResults([])
            handleSearch("")
          }}
        >
          {isSearching && <Icons.spinner height={16} width={16} />}
          {!isSearching && term && <Icons.close height={16} width={16} />}
        </div>
      </div>
      {speciesResults.length > 0 && (
        <div
          className={cn(
            "absolute left-0 top-full z-10 mt-2 w-full rounded-md border border-gray-300 bg-white shadow-lg",
            "max-h-80 overflow-y-auto"
          )}
        >
          <div className="flex flex-col divide-y">
            {speciesResults.map((species) => (
              <Link href={`/species/${species.id}`} className="px-2 transition-colors hover:bg-gray-100">
                <div key={species.id} className="flex items-center gap-2 p-2">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gray-200">
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
                      <div className="truncate text-sm font-semibold">{species.commonNames.en?.[0]}</div>
                      <div className="truncate text-sm font-semibold">{species.commonNames.fr?.[0]}</div>
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
  )
}
