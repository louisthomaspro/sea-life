import { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { habitatsDict } from "@/constants/habitats_dict"
import { rarityDict } from "@/constants/rarity_dict"
import { regionsDict } from "@/constants/regions_dict"
import { sociabilityDict } from "@/constants/sociability_dict"
import { taxonomyRankDict } from "@/constants/taxonomy-rank-dict"
import { AddToListTrigger } from "@/features/list/components/add-to-list-trigger"
import { Prisma, Taxa } from "@prisma/client"

import prisma from "@/lib/prisma"
import { buildSpeciesOgImageUrl, capitalizeWords } from "@/lib/utils"
import { Icons } from "@/components/ui/icons/icons"
import ImageLoader from "@/components/ui/image-loader"
import {
  SpeciesCarousel,
  SpeciesCarouselContent,
  SpeciesCarouselDots,
  SpeciesCarouselItem,
} from "@/components/ui/species-carousel"
import { Flag } from "@/components/flag"
import BackButton from "@/components/species/back-button"
import ShareButton from "@/components/species/share-button"
import { Attribute, HighlightAttributes } from "@/components/species/ui/highlight-attributes"
import { Section, SectionContent, SectionTitle } from "@/components/species/ui/section"

export async function generateMetadata({ params }: { params: { speciesId: string } }): Promise<Metadata> {
  const species = await prisma.taxa.findUnique({
    include: {
      medias: {
        select: {
          url: true,
          blurhashDataUrl: true,
        },
        orderBy: {
          position: "asc",
        },
      },
      attributes: true,
    },
    where: {
      id: Number(params.speciesId),
    },
  })

  if (!species) notFound()

  return {
    title: species.commonNames.en
      ? capitalizeWords(species.commonNames.en[0])
      : capitalizeWords(species.scientificName),
    description: "Discover the species",

    openGraph: {
      title: species.commonNames.en
        ? capitalizeWords(species.commonNames.en[0])
        : capitalizeWords(species.scientificName),

      description: "Discover the species",
      images: [
        {
          url: buildSpeciesOgImageUrl(`/api/og`, {
            name: species.commonNames.en ? capitalizeWords(species.commonNames.en[0]) : "",
            imageUrl: species.medias[0]?.url ?? "",
            scientificName: capitalizeWords(species.scientificName) ?? "",
            maxLength: String(species.attributes?.maxLength),
            maxDepth: String(species.attributes?.depthMax),
            minDepth: String(species.attributes?.depthMin),
            rarity: species.attributes?.rarity ?? "",
          }),
          width: 200,
          height: 200,
          alt: "Species image",
        },
      ],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/species/${params.speciesId}`,
    },
  }
}

export default async function SpeciesPage({ params }: { params: { speciesId: string } }) {
  const species = await prisma.taxa.findUnique({
    include: {
      medias: {
        select: {
          url: true,
          blurhashDataUrl: true,
        },
        orderBy: {
          position: "asc",
        },
      },
      ancestors: {
        orderBy: {
          rankLevel: "desc",
        },
      },
      attributes: true,
    },
    where: {
      id: Number(params.speciesId),
    },
  })

  if (!species) notFound()

  let attributes = species.attributes!

  return (
    <div>
      {/* Carousel */}
      <div className="relative">
        <BackButton />
        <AddToListTrigger speciesId={Number(params.speciesId)} />
        <ShareButton />
        <SpeciesCarousel className="aspect-[3/2] overflow-hidden rounded-b-md">
          <SpeciesCarouselContent>
            {species.medias.length === 0 && (
              <SpeciesCarouselItem>
                <ImageLoader
                  src={null}
                  width={200}
                  height={200}
                  alt="ads"
                  className="h-full w-full rounded-b-md object-cover"
                />
              </SpeciesCarouselItem>
            )}
            {species.medias.map((media, i) => (
              <SpeciesCarouselItem key={i}>
                <ImageLoader
                  src={media?.url}
                  blurhashDataURL={media?.blurhashDataUrl}
                  width={200}
                  height={200}
                  alt="ads"
                  className="h-full w-full rounded-b-md object-cover"
                  priority={i === 0}
                />
              </SpeciesCarouselItem>
            ))}
          </SpeciesCarouselContent>
          <SpeciesCarouselDots />
        </SpeciesCarousel>
      </div>
      <div className="container">
        {/* Title */}
        <div className="py-3">
          {species.commonNames.en && (
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              <Flag className="flex-none" countryCode="uk" />
              <span className="truncate">{capitalizeWords(species.commonNames.en[0])}</span>
            </h1>
          )}
          {species.commonNames.fr && (
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              <Flag className="flex-none" countryCode="fr" />
              <span className="truncate">{capitalizeWords(species.commonNames.fr[0])}</span>
            </h1>
          )}
          <p className="italic text-gray-600">{capitalizeWords(species.scientificName)}</p>
        </div>
        {/* HighlightAttributes */}
        {(attributes.maxLength || attributes.depthMax || attributes.depthMin) && (
          <HighlightAttributes className="my-2">
            {attributes.maxLength && (
              <Attribute>
                <Icons.maxLength className="size-6" />
                <span>
                  {"<"} {attributes.maxLength} cm
                </span>
              </Attribute>
            )}
            {attributes.depthMax && (
              <Attribute>
                <Icons.depth className="size-6" />
                <span>
                  {attributes.depthMin ?? 0} - {attributes.depthMax} m
                </span>
              </Attribute>
            )}
            {attributes.rarity && (
              <Attribute>
                <Icons.rarity className="size-6" />
                <span>{rarityDict[attributes.rarity].name.en}</span>
              </Attribute>
            )}
          </HighlightAttributes>
        )}
        <div className="mt-5 flex flex-col gap-4">
          {process.env.VERCEL_ENV === "development" && (
            <Section>
              <SectionTitle>Test</SectionTitle>
              <SectionContent>
                {Object.keys(attributes ?? {}).map((attribute) => (
                  <>
                    {(attributes as any)[attribute] && (attributes as any)[attribute].toString() && (
                      <div key={attribute}>
                        {attribute}: {(attributes as any)[attribute].toString()}
                      </div>
                    )}
                  </>
                ))}
              </SectionContent>
            </Section>
          )}
          {/* Environment */}
          {(attributes.primaryHabitats.length > 0 ||
            attributes.secondaryHabitats.length > 0 ||
            attributes.regions.length > 0) && (
            <Section>
              <SectionTitle>Environment</SectionTitle>
              <SectionContent>
                {(attributes.primaryHabitats.length > 0 || attributes.secondaryHabitats.length > 0) && (
                  <div className="flex items-center gap-2">
                    <Icons.habitat className="size-5 flex-none" />
                    <div className="flex flex-col">
                      {attributes.primaryHabitats.length && (
                        <div className="font-medium">
                          {attributes.primaryHabitats
                            .map((habitat: string) => habitatsDict[habitat].title.en)
                            .join(", ")}
                        </div>
                      )}
                      {attributes.secondaryHabitats.length > 0 && (
                        <div className="text-muted-foreground">
                          {attributes.secondaryHabitats
                            .map((habitat: string) => habitatsDict[habitat].title.en)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {attributes.regions.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Icons.region className="size-5 flex-none" />
                    <div className="font-medium">
                      {attributes.regions.map((region: string) => regionsDict[region].name.en).join(", ")}
                    </div>
                  </div>
                )}
              </SectionContent>
            </Section>
          )}
          {/* LifeStyle and behavior */}
          {attributes.sociability && (
            <Section>
              <SectionTitle>Lifestyle and behavior</SectionTitle>
              <SectionContent>
                {attributes.sociability && (
                  <div className="flex items-center gap-2">
                    <Icons.sociability className="size-5 flex-none" />
                    <div className="font-medium">{sociabilityDict[attributes.sociability].name.en}</div>
                  </div>
                )}
              </SectionContent>
            </Section>
          )}
          {/* Taxonomy */}
          <Section>
            <SectionTitle>Taxonomy</SectionTitle>
            {Taxonomy(species.ancestors)}
          </Section>
        </div>
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
        <div className="font-medium">
          {taxa.commonNames.en ? capitalizeWords(taxa.commonNames.en[0]) : capitalizeWords(taxa.scientificName)}
        </div>
        {/* Rank */}
        <div className="text-sm text-muted-foreground">{taxonomyRankDict[taxa.rank].en}</div>
      </li>
      {Taxonomy(ancestors)}
    </ul>
  )
}
