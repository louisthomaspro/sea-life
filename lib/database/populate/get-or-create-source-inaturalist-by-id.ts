import { INaturalistTaxa } from "@/types/inaturalist-taxa"
import prisma from "@/lib/prisma"

export const getOrCreateSourceInaturalistById = async (inaturalistId: number) => {
  // Get inaturalist data from db
  let sourceInaturalist = await prisma.source.findUnique({
    where: {
      sourceId_name_context_taxaId: {
        sourceId: inaturalistId.toString(),
        name: "inaturalist",
        context: "taxa_api",
        taxaId: inaturalistId,
      },
    },
  })
  let taxaApiResult: INaturalistTaxa = sourceInaturalist?.json as INaturalistTaxa
  if (sourceInaturalist && taxaApiResult) {
    return sourceInaturalist
  }

  // If not found, fetch from inaturalist
  console.log(`Add inaturalist source for ${inaturalistId}`)
  const taxaResponse = await fetch(`https://api.inaturalist.org/v1/taxa/${inaturalistId}?all_names=true`)
  const taxaJson = await taxaResponse.json()
  await new Promise((resolve) => setTimeout(resolve, 1000)) // Avoid rate limiting

  if (taxaJson.results.length === 0) throw new Error(`No inaturalist results for id ${inaturalistId}`)
  taxaApiResult = taxaJson.results[0] as INaturalistTaxa

  sourceInaturalist = await prisma.source.upsert({
    where: {
      sourceId_name_context_taxaId: {
        sourceId: inaturalistId.toString(),
        name: "inaturalist",
        context: "taxa_api",
        taxaId: inaturalistId,
      },
    },
    update: {
      json: taxaJson.results[0],
      updatedAt: new Date(),
    },
    create: {
      sourceId: inaturalistId.toString(),
      name: "inaturalist",
      context: "taxa_api",
      taxa: {
        connect: {
          id: inaturalistId,
        },
      },
      json: taxaJson.results[0],
    },
  })

  return sourceInaturalist
}
