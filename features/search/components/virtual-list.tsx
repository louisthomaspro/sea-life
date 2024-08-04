"use client"

import Link from "next/link"
import { Virtuoso } from "react-virtuoso"

import ImageLoader from "@/components/ui/image-loader"
import { Flag } from "@/components/flag"

export default function VirtualList({ results }: { results: any[] }) {
  return (
    <Virtuoso
      useWindowScroll
      totalCount={results.length}
      style={{ height: `${results.length * 74}px` }}
      itemContent={(index) => {
        const species = results[index]
        return (
          <Link href={`/species/${species.id}`} className="overflow-auto transition-colors hover:bg-gray-100">
            <div key={species.id} className="flex items-center gap-2 px-2 py-1">
              <div className="relative h-24 w-24 flex-none overflow-hidden rounded-md bg-gray-200">
                <ImageLoader
                  key={species.id}
                  src={species.url}
                  alt={species.scientificName}
                  width={100}
                  height={100}
                  className="size-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div>
                  <div className="flex items-center gap-2">
                    <Flag className="flex-none" countryCode="uk" />
                    <span className="truncate text-sm font-semibold">{species.commonNames.en?.[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="flex-none" countryCode="fr" />
                    <span className="truncate text-sm font-semibold">{species.commonNames.fr?.[0]}</span>
                  </div>
                </div>
                <div className="truncate text-xs italic text-gray-500">{species.scientificName}</div>
              </div>
            </div>
          </Link>
        )
      }}
    />
  )
}
