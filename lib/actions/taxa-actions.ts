import { INaturalistTaxa } from "@/types/inaturalist-taxa"
import { getOrCreateSourceInaturalist } from "@/lib/actions/source-inaturalist"
import prisma from "@/lib/prisma"

export const getOrCreateTaxaById = async (id: number) => {
  // Does it exist?
  const existingTaxa = await prisma.taxa.findUnique({
    where: {
      id,
    },
  })
  if (existingTaxa && existingTaxa.parentId) return existingTaxa

  // If not, get the source data
  const sourceInaturalist = await getOrCreateSourceInaturalist(id)
  const apiResult = sourceInaturalist.taxaApiResult as unknown as INaturalistTaxa

  // Create the taxa
  console.log(`Add taxa id: ${id}`)
  let scientificName = ""
  const commonNames: any = {}
  apiResult.names.forEach((name: { name: string; locale: string; lexicon: string }) => {
    if (name.lexicon === "scientific-names") {
      scientificName = name.name
    } else {
      commonNames[name.locale] = (commonNames[name.locale] ?? []).concat(name.name)
    }
  })
  if (!scientificName) throw new Error("No scientific name")

  // Create parent if it exists
  if (apiResult.parent_id) await getOrCreateTaxaById(apiResult.parent_id)

  const newTaxa = await prisma.taxa.upsert({
    where: {
      id,
    },
    update: {
      scientificName,
      commonNames,
      rank: apiResult.rank,
      rankLevel: apiResult.rank_level,
      parentId: apiResult.parent_id,
      externalIds: {
        create: {
          externalId: id.toString(),
          source: "inaturalist",
        },
      },
    },
    create: {
      id,
      scientificName,
      commonNames,
      rank: apiResult.rank,
      rankLevel: apiResult.rank_level,
      parentId: apiResult.parent_id,
      externalIds: {
        create: {
          externalId: id.toString(),
          source: "inaturalist",
        },
      },
    },
  })

  return newTaxa
}
