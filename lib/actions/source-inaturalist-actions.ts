import { INaturalistTaxa } from "@/types/inaturalist-taxa"
import prisma from "@/lib/prisma"

export const getOrCreateSourceInaturalist = async (inaturalistId: number) => {
  // Does it exist?
  let sourceInaturalist = await prisma.source.findUnique({
    where: {
      id_name_context_taxaId: {
        id: inaturalistId.toString(),
        name: "inaturalist",
        context: "taxa_api",
        taxaId: inaturalistId,
      },
    },
  })
  let taxaApiResult = sourceInaturalist?.json as unknown as INaturalistTaxa
  if (sourceInaturalist && taxaApiResult) return sourceInaturalist

  // If not, fetch it
  console.log(`Add inaturalist source for ${inaturalistId}`)
  const taxaResponse = await fetch(`https://api.inaturalist.org/v1/taxa/${inaturalistId}?all_names=true`)
  const taxaJson = await taxaResponse.json()
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (taxaJson.results.length === 0) throw new Error(`No inaturalist results for id ${inaturalistId}`)
  taxaApiResult = taxaJson.results[0]

  sourceInaturalist = await prisma.source.upsert({
    where: {
      id_name_context_taxaId: {
        id: inaturalistId.toString(),
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
      id: inaturalistId.toString(),
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
