import "server-cli-only"

import { Prisma, Taxa } from "@prisma/client"

import prisma from "@/lib/prisma"

export const getSpeciesByAncestorList2 = async (taxaIds: number[]) => {
  // type
  type TaxaWithMedia = Taxa & {
    medias: {
      url: string
    }[]
  }

  const query = Prisma.sql`
  SELECT 
  t.*, 
  array_agg(json_build_object('url', m.url)) AS medias
  FROM "Taxa" t
  INNER JOIN "_Ancestors" a ON a."A" = t.id
  INNER JOIN "TaxaMedia" m ON t.id = m."taxaId"
  AND t.rank LIKE 'species'
  AND a."B" IN (${Prisma.join(taxaIds)})
  GROUP BY t.id
  `

  const species = await prisma.$queryRaw<TaxaWithMedia[]>(query)
  return species
}

export const getSpeciesByAncestorList = async (taxaIds: number[]) => {
  const speciesList = await prisma.taxa.findMany({
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
}
