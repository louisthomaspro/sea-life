import { notFound } from "next/navigation"
import { taxonomyRankDict } from "@/constants/taxonomy-rank-dict"
import { AddToListTrigger } from "@/features/list/components/add-to-list-trigger"
import { Taxa } from "@prisma/client"

import prisma from "@/lib/prisma"
import { capitalizeWords } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel"
import ImageLoader from "@/components/ui/image-loader"
import { Flag } from "@/components/flag"
import BackButton from "@/components/species/back-button"

export default async function SpeciesPage({ params }: { params: { speciesId: string } }) {
  const species = await prisma.taxa.findUnique({
    include: {
      medias: true,
      ancestors: true,
      attributes: true,
    },
    where: {
      id: Number(params.speciesId),
    },
  })

  if (!species) notFound()

  return (
    <div>
      <div className="relative">
        <BackButton />
        <AddToListTrigger speciesId={Number(params.speciesId)} />
        <Carousel className="aspect-[3/2] overflow-hidden rounded-b-md">
          <CarouselContent>
            {species.medias.length === 0 && (
              <CarouselItem>
                <ImageLoader
                  src={null}
                  width={200}
                  height={200}
                  alt="ads"
                  className="h-full w-full rounded-b-md object-cover"
                />
              </CarouselItem>
            )}
            {species.medias.map((media, i) => (
              <CarouselItem key={i}>
                <ImageLoader
                  src={media?.url}
                  width={200}
                  height={200}
                  alt="ads"
                  className="h-full w-full rounded-b-md object-cover"
                  priority={i === 0}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots />
        </Carousel>
      </div>
      {/* Title */}
      <div className="p-3">
        {species.commonNames.en && (
          <h1 className="flex items-center gap-2 text-lg font-bold">
            <Flag className="flex-none" countryCode="uk" />
            <span className="truncate">{capitalizeWords(species.commonNames.en[0])}</span>
          </h1>
        )}
        {species.commonNames.fr && (
          <h1 className="flex items-center gap-2 text-lg font-bold">
            <Flag className="flex-none" countryCode="fr" />
            <span className="truncate">{capitalizeWords(species.commonNames.fr[0])}</span>
          </h1>
        )}
        <p className="text-gray-600">{capitalizeWords(species.scientificName)}</p>
      </div>
      {/* Attributes */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold">ATTRIBUTES</h2>
        <div>
          {species.attributes.map((attribute, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-bold">{attribute.attributeDefinitionId}</span>
              <span>{JSON.stringify(attribute.value)}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Taxonomy */}
      <div className="px-4 pb-4">
        <h2 className="text-lg font-bold">TAXONOMY</h2>
        {Taxonomy(species.ancestors)}
      </div>
    </div>
  )
}

const Taxonomy = (ancestors: Taxa[]) => {
  if (ancestors.length === 0) {
    return ""
  }
  const taxa = ancestors[0]
  ancestors.shift()

  return (
    <ul className="list-disc pl-4">
      <li>
        {/* Name */}
        <div className="name">
          {taxa.commonNames.fr ? capitalizeWords(taxa.commonNames.fr[0]) : capitalizeWords(taxa.scientificName)}
        </div>
        {/* Rank */}
        <div className="rank">{taxonomyRankDict[taxa.rank].en}</div>
      </li>
      {Taxonomy(ancestors)}
    </ul>
  )
}
