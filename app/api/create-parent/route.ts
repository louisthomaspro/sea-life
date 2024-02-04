import { INaturalistTaxa } from "@/types/inaturalist-taxa"
import { getOrCreateSourceInaturalist } from "@/lib/actions/source-inaturalist"
import { getOrCreateTaxaById } from "@/lib/actions/taxa-actions"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const taxaData = await prisma.taxa.findMany({
    select: {
      id: true,
      parentId: true,
      parent: true,
    },
    orderBy: {
      id: "asc",
    },
  })

  for (const [index, value] of taxaData.entries()) {
    console.log(`processing ${index + 1} / ${taxaData.length}, id: ${value.id}`)

    const sourceInaturalistData = await getOrCreateSourceInaturalist(value.id)

    const taxaApiResult = sourceInaturalistData.taxaApiResult as unknown as INaturalistTaxa

    for (const parentId of taxaApiResult.ancestor_ids) {
      await getOrCreateTaxaById(parentId)
    }
  }

  return new Response()
}
