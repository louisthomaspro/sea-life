import "server-only"

import Link from "next/link"
import { Prisma } from "@prisma/client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import ImageLoader from "@/components/ui/image-loader"

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
    <div>
      <Link key={group.id} href={`/explore/${group.slug}`} className="flex items-center pb-1">
        <div className="flex grow gap-2 truncate font-semibold">
          <span>{group.commonNames.en}</span>
          <Badge variant={"secondary"}>{group.speciesCount}</Badge>
        </div>
        <div className="flex flex-none items-center text-sm font-medium text-muted-foreground">
          <span>See more</span>
          <Icons.chevronRight className="ml-1 size-3" />
        </div>
      </Link>
      <SpeciesList group={group} />
    </div>
  )
}

// function SpeciesListSuspense() {
//   return (
//     <div className="flex h-20 gap-1">
//       {Array.from({ length: 3 }).map((_, index) => (
//         <Skeleton key={index} className="relative aspect-[3/2] flex-none rounded-xl" />
//       ))}
//     </div>
//   )
// }

async function SpeciesList({ group }: { group: groupWithHighlightedSpecies }) {
  return (
    <div className="relative -ml-4 -mr-4 flex">
      <div className="no-scrollbar space-x-1 overflow-auto whitespace-nowrap">
        {group.highlightedSpecies.map((species, index) => (
          <Link
            key={index}
            href={`/species/${species.id}`}
            className={cn(
              "relative inline-block aspect-[3/2] w-28 overflow-hidden rounded-xl",
              group.speciesCount <= 5 && index === group.speciesCount - 1 && "!mr-4",
              index === 0 && "!ml-4"
            )}
          >
            <ImageLoader
              src={species.medias[0]?.url}
              alt={species.commonNames.en?.[0]!}
              fill
              sizes="150px"
              className="object-cover"
            />
          </Link>
        ))}
        {/* View more */}
        {group.speciesCount > 5 && (
          <Link
            href={`/explore/${group.slug}`}
            className="relative !mr-4 inline-block aspect-[3/2] w-28 overflow-hidden rounded-xl border border-gray-200 bg-gray-50"
          >
            <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
              <div className="rounded-full bg-gray-200 p-1">
                <Icons.chevronRight className="size-3" />
              </div>
              <span className="text-xs">See more</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
