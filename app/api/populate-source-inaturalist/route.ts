import { unstable_noStore } from "next/cache"

import { getOrCreateSourceInaturalist } from "@/lib/actions/source-inaturalist"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  unstable_noStore()
  const iNaturalistData = await prisma.sourceInaturalist.findMany({
    select: {
      id: true,
      taxaApiResult: true,
    },
    orderBy: {
      id: "asc",
    },
  })

  for (const [index, value] of iNaturalistData.entries()) {
    console.log(`processing ${index + 1} / ${iNaturalistData.length}`)
    getOrCreateSourceInaturalist(value.id)
  }

  return new Response()
}
