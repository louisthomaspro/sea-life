import Link from "next/link"
import { Prisma } from "@prisma/client"

import { Card, CardContent } from "@/components/ui/card"
import ImageLoader from "@/components/ui/image-loader"

type taxaSpecies = Prisma.TaxaGetPayload<{
  include: {
    medias: {
      select: {
        url: true
      }
    }
  }
}>

export default function SpeciesCard({ species }: { species: taxaSpecies }) {
  return (
    <Link key={species.id} href={`/species/${species.id}`}>
      <Card>
        <CardContent className="relative p-0">
          <div className="relative aspect-[3/2] w-full">
            <ImageLoader
              src={species.medias[0]?.url}
              alt={species.commonNames.en?.[0]!}
              sizes="50vw"
              fill
              className="rounded-xl object-cover"
            />
          </div>
          <div className="grid p-2">
            <div className="overflow-auto">
              <div className="truncate font-semibold">{species.commonNames.en?.[0]}</div>
              <div className="truncate font-semibold">{species.commonNames.fr?.[0]}</div>
            </div>
            <div className="truncate text-sm italic text-gray-500">{species.scientificName}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
