import { Metadata } from "next"
import { notFound } from "next/navigation"
import { habitatsDict } from "@/constants/habitats_dict"
import { rarityDict } from "@/constants/rarity_dict"
import { regionsDict } from "@/constants/regions_dict"
import { sociabilityDict } from "@/constants/sociability_dict"
import { taxonomyRankDict } from "@/constants/taxonomy-rank-dict"
import { AddToListTrigger } from "@/features/list/components/add-to-list-trigger"
import { AttributeEnum, Prisma, Taxa } from "@prisma/client"

import prisma from "@/lib/prisma"
import { buildSpeciesOgImage, capitalizeWords } from "@/lib/utils"
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from "@/components/ui/carousel"
import { Icons } from "@/components/ui/icons/icons"
import ImageLoader from "@/components/ui/image-loader"
import { Flag } from "@/components/flag"
import BackButton from "@/components/species/back-button"
import ShareButton from "@/components/species/share-button"
import { Attribute, HighlightAttributes } from "@/components/species/ui/highlight-attributes"
import { Section, SectionContent, SectionTitle } from "@/components/species/ui/section"

export async function generateMetadata({ params }: { params: { speciesId: string } }): Promise<Metadata> {
  const species = await prisma.taxa.findUnique({
    include: {
      medias: true,
      attributes: {
        include: {
          attributeDefinition: true,
        },
      },
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
    openGraph: {
      title: species.commonNames.en
        ? capitalizeWords(species.commonNames.en[0])
        : capitalizeWords(species.scientificName),

      ...(species.commonNames.en?.[0] ? { description: capitalizeWords(species.scientificName) } : {}),
      images: [
        {
          url: buildSpeciesOgImage({
            name: species.commonNames.en ? capitalizeWords(species.commonNames.en[0]) : "",
            imageUrl: species.medias[0]?.url ?? "",
            scientificName: capitalizeWords(species.scientificName) ?? "",
            maxLength:
              species.attributes.find((attribute) => attribute.attributeDefinitionId === "max_length")?.value ?? "",
            maxDepth:
              species.attributes.find((attribute) => attribute.attributeDefinitionId === "depth_max")?.value ?? "",
            minDepth:
              species.attributes.find((attribute) => attribute.attributeDefinitionId === "depth_min")?.value ?? "",
            rarity: species.attributes.find((attribute) => attribute.attributeDefinitionId === "rarity")?.value ?? "",
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
      medias: true,
      ancestors: {
        orderBy: {
          rankLevel: "desc",
        },
      },
      attributes: {
        include: {
          attributeDefinition: true,
        },
      },
    },
    where: {
      id: Number(params.speciesId),
    },
  })

  if (!species) notFound()

  let attributesMap: {
    [key in AttributeEnum]?: Prisma.AttributeGetPayload<{ include: { attributeDefinition: true } }>
  } = {}
  species.attributes.forEach((attribute) => {
    attributesMap[attribute.attributeDefinitionId] = attribute
  })

  return (
    <div>
      {/* Carousel */}
      <div className="relative">
        <BackButton />
        <AddToListTrigger speciesId={Number(params.speciesId)} />
        <ShareButton />
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
          <p className="text-gray-600">{capitalizeWords(species.scientificName)}</p>
        </div>
        {/* HighlightAttributes */}
        {(attributesMap.max_length || attributesMap.depth_max || attributesMap.rarity) && (
          <HighlightAttributes>
            {attributesMap.max_length && (
              <Attribute>
                <Icons.maxLength className="size-6" />
                <span>
                  {"<"} {attributesMap.max_length.value} cm
                </span>
              </Attribute>
            )}
            {attributesMap.depth_max && (
              <Attribute>
                <Icons.depth className="size-6" />
                <span>
                  {attributesMap.depth_min?.value ?? 0} - {attributesMap.depth_max.value} m
                </span>
              </Attribute>
            )}
            {attributesMap.rarity && (
              <Attribute>
                <Icons.rarity className="size-6" />
                <span>{rarityDict[attributesMap.rarity.value].name.en}</span>
              </Attribute>
            )}
          </HighlightAttributes>
        )}
        {process.env.VERCEL_ENV === "development" && (
          <Section>
            <SectionTitle>Test</SectionTitle>
            <SectionContent>
              {species.attributes.map((attribute) => (
                <div key={attribute.attributeDefinitionId}>
                  {attribute.attributeDefinition.id}: {attribute.value}
                </div>
              ))}
            </SectionContent>
          </Section>
        )}
        {/* Environment */}
        {(attributesMap.primary_habitats || attributesMap.secondary_habitats || attributesMap.regions) && (
          <Section>
            <SectionTitle>Environment</SectionTitle>
            <SectionContent>
              {(attributesMap.primary_habitats || attributesMap.secondary_habitats) && (
                <div className="flex items-center gap-2">
                  <Icons.habitat className="size-5 flex-none" />
                  <div className="flex flex-col">
                    {attributesMap.primary_habitats && (
                      <div className="font-medium">
                        {attributesMap.primary_habitats?.value
                          .map((habitat: string) => habitatsDict[habitat].title.en)
                          .join(", ")}
                      </div>
                    )}
                    {attributesMap.secondary_habitats && (
                      <div className="text-muted-foreground">
                        {attributesMap.secondary_habitats?.value
                          .map((habitat: string) => habitatsDict[habitat].title.en)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {attributesMap.regions && (
                <div className="flex items-center gap-2">
                  <Icons.region className="size-5 flex-none" />
                  <div className="font-medium">
                    {attributesMap.regions?.value.map((region: string) => regionsDict[region].name.en).join(", ")}
                  </div>
                </div>
              )}
            </SectionContent>
          </Section>
        )}
        {/* LifeStyle and behavior */}
        {attributesMap.sociability && (
          <Section>
            <SectionTitle>Lifestyle and behavior</SectionTitle>
            <SectionContent>
              {attributesMap.sociability && (
                <div className="flex items-center gap-2">
                  <Icons.sociability className="size-5 flex-none" />
                  <div className="font-medium">{sociabilityDict[attributesMap.sociability.value].name.en}</div>
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
