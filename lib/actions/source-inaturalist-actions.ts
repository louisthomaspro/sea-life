import { INaturalistTaxa } from "@/types/inaturalist-taxa"
import prisma from "@/lib/prisma"

export const getOrCreateSourceInaturalist = async (inaturalistId: number) => {
  // Does it exist?
  let sourceInaturalist = await prisma.sourceInaturalist.findUnique({
    where: {
      id: inaturalistId,
    },
    select: {
      taxaApiResult: true,
    },
  })
  let taxaApiResult = sourceInaturalist?.taxaApiResult as unknown as INaturalistTaxa
  if (sourceInaturalist && taxaApiResult) return sourceInaturalist

  // If not, fetch it
  console.log(`Add inaturalist source for ${inaturalistId}`)
  const taxaResponse = await fetch(`https://api.inaturalist.org/v1/taxa/${inaturalistId}?all_names=true`)
  const taxaJson = await taxaResponse.json()
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (taxaJson.results.length === 0) throw new Error(`No inaturalist results for id ${inaturalistId}`)
  taxaApiResult = taxaJson.results[0]

  sourceInaturalist = await prisma.sourceInaturalist.upsert({
    where: {
      id: inaturalistId,
    },
    update: {
      taxaApiResult: taxaJson.results[0],
      updatedAt: new Date(),
    },
    create: {
      id: inaturalistId,
      taxaApiResult: taxaJson.results[0],
    },
  })

  return sourceInaturalist
}
