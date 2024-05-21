"use client"

import Image from "next/image"

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
    <DrawerContent className="max-h-[80vw]">
      <div className="overflow-auto">
        <h1>Search Results Drawer Content</h1>
        <div className="flex flex-col gap-1">
          {results.map((result) => (
            <div key={result.id} className="flex border">
              <div className="relative aspect-[3/2] w-32">
                <ImageLoader
                  src={result?.url}
                  alt={result.scientificName}
                  width={200}
                  height={200}
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <p>
                  caudal_fin_shape: <span className="font-semibold">{result.caudal_fin_shape}</span>
                </p>
                <p>
                  colors: <span className="font-semibold">{result.colors?.join(", ")}</span>
                </p>
                <p>
                  regions: <span className="font-semibold">{result.regions?.join(", ")}</span>
                </p>
                <p>
                  patterns: <span className="font-semibold">{result.patterns?.join(", ")}</span>
                </p>
                <p>
                  body_shape: <span className="font-semibold">{result.body_shape}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DrawerContent>
  )
}
