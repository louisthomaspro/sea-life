"use client"

import Image from "next/image"
import Link from "next/link"

import { pushModal } from "@/lib/pushmodal/pushmodal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DrawerContent } from "@/components/ui/drawer"
import ImageLoader from "@/components/ui/image-loader"
import { SearchResult } from "@/app/api/search-advanced/route"

export const SearchResultsButton = ({ results }: { results: SearchResult[] }) => {
  return (
    <Button
      className="fixed bottom-20 right-2 gap-2 sm:left-1/2 sm:right-auto sm:translate-x-1/2"
      variant={"outline"}
      size={"lg"}
      onClick={() => pushModal("SearchResultsDrawer", { results })}
    >
      <span>Show results</span>
      <Badge>{results.length}</Badge>
    </Button>
  )
}

export default function SearchResultsDrawerContent({ results }: { results: SearchResult[] }) {
  return (
    <DrawerContent className="max-h-[100vh]">
      <div className="max-h-[90vh] overflow-auto">
        <div className="flex flex-col divide-y">
          {results.map((species) => (
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
            // <div key={result.id} className="flex border">
            //   <div className="relative aspect-[3/2] w-32">
            //     <ImageLoader
            //       src={result?.url}
            //       alt={result.scientificName}
            //       width={200}
            //       height={200}
            //       className="object-cover"
            //     />
            //   </div>
            //   <div className="flex flex-col">
            //     <p>{result.id}</p>
            //     <p>
            //       caudal_fin_shape: <span className="font-semibold">{result.caudal_fin_shape}</span>
            //     </p>
            //     <p>
            //       colors: <span className="font-semibold">{result.colors?.join(", ")}</span>
            //     </p>
            //     <p>
            //       regions: <span className="font-semibold">{result.regions?.join(", ")}</span>
            //     </p>
            //     <p>
            //       patterns: <span className="font-semibold">{result.patterns?.join(", ")}</span>
            //     </p>
            //     <p>
            //       body_shape: <span className="font-semibold">{result.body_shape}</span>
            //     </p>
            //   </div>
            // </div>
          ))}
        </div>
      </div>
    </DrawerContent>
  )
}
