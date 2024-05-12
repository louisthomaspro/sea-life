"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"

import { getListsAction } from "@/lib/services/lists-actions"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons/icons"
import ImageLoader from "@/components/ui/image-loader"

export default function ListsListing() {
  let { data: lists, isLoading } = useQuery({
    queryKey: ["lists"],
    queryFn: async () => getListsAction(),
  })

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Icons.spinner className="h-5 w-5" />
      </div>
    )
  }

  return (
    <div className="mb-10 mt-4 grid grid-cols-2 gap-4">
      {lists?.map((list, i) => (
        <Link key={i} href={`/lists/${list.id}`}>
          <Card>
            <CardContent className="relative p-0">
              <div className="relative">
                <div className="grid grid-cols-2 gap-0.5">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="relative aspect-[3/2] overflow-hidden rounded-sm">
                      {list.species[index] ? (
                        <ImageLoader
                          src={list.species[index].taxa.medias[0]?.url}
                          alt={list.species[index].taxa.commonNames.en?.[0] ?? ""}
                          fill
                          sizes="25vw"
                          className="object-cover"
                        />
                      ) : (
                        <ImageLoader
                          src="/img/fallback.jpg"
                          sizes="25vw"
                          alt="placeholder"
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <Badge className="absolute -bottom-2 -right-2">{list._count.species}</Badge>
              </div>
              <div className="grid p-2">
                <div className="overflow-auto">
                  <div className="truncate font-semibold">{list.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
