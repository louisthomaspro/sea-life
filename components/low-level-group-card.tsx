import "server-only"

import { Suspense } from "react"
import Link from "next/link"
import { Prisma } from "@prisma/client"

import { getSpeciesByAncestorList } from "@/lib/database/utils"
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
    <Link key={group.id} href={`/explore/${group.slug}`}>
      <div>
        <div className="truncate font-semibold">{group.commonNames.en}</div>
        <Suspense fallback={<div>Loading...</div>}>
          <SpeciesList group={group} />
        </Suspense>
      </div>
    </Link>
  )
}

async function SpeciesList({ group }: { group: groupWithHighlightedSpecies }) {
  let species: Prisma.TaxaGetPayload<{
    include: {
      medias: {
        select: {
          url: true
        }
      }
    }
  }>[] = []
  // species = await getSpeciesByAncestorList(group.highLevelTaxa.map((taxa) => taxa.id))

  return (
    <div className="flex gap-2">
      {species.map((species) => (
        <Link key={species.id} href={`/species/${species.id}`} className="relative aspect-[3/2]">
          <ImageLoader
            src={species.medias[0].url}
            alt={species.commonNames.en?.[0]!}
            fill
            className="rounded-xl object-cover"
          />
        </Link>
      ))}
    </div>
  )
}
