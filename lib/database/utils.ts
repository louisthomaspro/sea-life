import prisma from "@/lib/prisma"

// DEPRECATED
// export const getSpeciesByAncestorList = async (taxaIds: number[]) => {
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

export const getSpeciesByAncestorList = async (taxaIds: number[]) => {
  const speciesList = await prisma.taxa.findMany({
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
    include: {
      medias: true,
    },
  })

  return speciesList
}
