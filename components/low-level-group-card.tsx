import "server-only"

import { Suspense } from "react"
import Link from "next/link"
import { Prisma } from "@prisma/client"

import { getSpeciesByAncestorList } from "@/lib/database/utils"
import { CarouselSpecies, CarouselSpeciesContent, CarouselSpeciesItem } from "@/components/ui/carousel-species-group"
import { Icons } from "@/components/ui/icons"
import ImageLoader from "@/components/ui/image-loader"
import { Skeleton } from "@/components/ui/skeleton"

type groupWithHighlightedSpecies = Prisma.GroupGetPayload<{
  include: {
    highlightedSpecies: {
      include: {
        medias: true
      }
    }
    highLevelTaxa: true
  }
}>

export default function LowLevelGroupCard({ group }: { group: groupWithHighlightedSpecies }) {
  return (
    <div className="pb-2">
      <Link key={group.id} href={`/explore/${group.slug}`} className="flex items-center pb-1">
        <div className="grow truncate font-semibold">{group.commonNames.en}</div>
        <div className="flex flex-none items-center text-sm font-medium text-muted-foreground">
          <span>view all</span>
          <Icons.chevronRight className="ml-1 size-3" />
        </div>
      </Link>
      <Suspense fallback={<SpeciesListSuspense />}>
        <SpeciesList group={group} />
      </Suspense>
    </div>
  )
}

function SpeciesListSuspense() {
  return (
    <div className="flex h-24 gap-1">
      {Array.from({ length: 3 }).map((_, index) => (
        <Skeleton key={index} className="relative aspect-[3/2] flex-none rounded-xl" />
      ))}
    </div>
  )
}

async function SpeciesList({ group }: { group: groupWithHighlightedSpecies }) {
  const species = await getSpeciesByAncestorList(group.highLevelTaxa.map((taxa) => taxa.id))

  return (
    <CarouselSpecies
      opts={{
        align: "start",
        dragFree: true,
      }}
      className="-ml-4 -mr-4"
    >
      <CarouselSpeciesContent className="ml-3 h-24 w-full">
        {species.map((species, index) => (
          <CarouselSpeciesItem key={index} className="flex-none pl-1">
            <Link
              href={`/species/${species.id}`}
              className="relative block aspect-[3/2] size-full overflow-hidden rounded-xl"
            >
              <ImageLoader
                src={species.medias[0].url}
                alt={species.commonNames.en?.[0]!}
                fill
                className="object-cover"
              />
            </Link>
          </CarouselSpeciesItem>
        ))}
      </CarouselSpeciesContent>
    </CarouselSpecies>
  )
}
