"use client"

import Link from "next/link"
import { useSearch } from "@/features/search/search-provider"
import { Virtuoso } from "react-virtuoso"

import ImageLoader from "@/components/ui/image-loader"

export default function ResultsPage() {
  const { results, isSearching } = useSearch()

  return (
    <div>
      <Virtuoso
        useWindowScroll
        totalCount={results.length}
        itemContent={(index) => {
          const species = results[index]
          return (
            <Link href={`/species/${species.id}`} className="flex px-2 transition-colors hover:bg-gray-100">
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
          )
        }}
      />
    </div>
  )
}
