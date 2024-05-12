import Link from "next/link"
import { Prisma } from "@prisma/client"

import { capitalizeWords, cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import ImageLoader from "@/components/ui/image-loader"

interface SpeciesCardProps extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> {
  species: Prisma.TaxaGetPayload<{
    include: {
      medias: {
        select: {
          url: true
        }
      }
    }
  }>
}

export default function SpeciesCard({ species, className, ...props }: SpeciesCardProps) {
  return (
    <Link
      key={species.id}
      href={`/species/${species.id}`}
      className={cn("transition-transform hover:scale-[99%] active:scale-[98%]", className)}
      {...props}
    >
      <Card>
        <CardContent className="relative p-0">
          <div className="relative aspect-[3/2] w-full">
            <ImageLoader
              src={species.medias[0]?.url}
              alt={species.commonNames.en?.[0]!}
              sizes="50vw"
              fill
              className="rounded-lg object-cover"
            />
          </div>
          <div className="grid p-2">
            <div className="overflow-auto">
              <div className="truncate font-semibold">
                {species.commonNames.en?.[0] && capitalizeWords(species.commonNames.en?.[0])}
              </div>
              <div className="truncate font-semibold">
                {species.commonNames.fr?.[0] && capitalizeWords(species.commonNames.fr?.[0])}
              </div>
            </div>
            <div className="truncate text-sm italic text-gray-500">{capitalizeWords(species.scientificName)}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
