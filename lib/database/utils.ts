import "server-only"

import { cache } from "react"
import { Prisma } from "@prisma/client"

import prisma from "@/lib/prisma"

// export const getSpeciesByAncestorList2 = async (taxaIds: number[]) => {
//   const query = Prisma.sql`
//   WITH RECURSIVE TaxaHierarchy AS (
//     SELECT * FROM taxa WHERE id IN (${Prisma.join(taxaIds)})
//     UNION ALL
//     SELECT t.* FROM taxa t JOIN TaxaHierarchy th ON t."parentId" = th.id
//   )
//   SELECT * FROM TaxaHierarchy th
//   JOIN media m ON th.id = m."taxaId"
//   WHERE rank = 'species'
//   `

//   const species = await prisma.$queryRaw<Taxa[]>(query)
//   return species
// }

export const getSpeciesByAncestorList = cache(async (taxaIds: number[]) => {
  const speciesList = await prisma.taxa.findMany({
    include: {
      medias: {
        select: {
          url: true,
        },
      },
    },
    where: {
      ancestors: {
        some: {
          id: {
            in: taxaIds,
          },
        },
      },
      rank: {
        equals: "species",
      },
    },
  })

  return speciesList
})
