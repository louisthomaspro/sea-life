import prisma from "@/lib/prisma"

/**
 * Populates following fields for a group:
 * - speciesCount
 * - highlightedSpecies (5 species randomly selected from group)
 */
export const populateGroupById = async (id: number) => {
  const group = await prisma.group.findFirst({
    include: {
      highLevelTaxa: true,
    },
    where: {
      id,
    },
  })

  if (!group) {
    throw new Error(`Group with id ${id} not found`)
  }

  const speciesCount = await prisma.taxa.count({
    where: {
      rank: "species",
      ancestors: {
        some: {
          id: {
            in: group.highLevelTaxa.map((taxon) => taxon.id),
          },
        },
      },
    },
  })

  const highlightedTaxa = await prisma.taxa.findMany({
    take: 5,
    select: {
      id: true,
    },
    where: {
      rank: {
        equals: "species",
      },
      ancestors: {
        some: {
          id: {
            in: group.highLevelTaxa.map((taxon) => taxon.id),
          },
        },
      },
    },
  })

  return prisma.group.update({
    where: {
      slug: group.slug,
    },
    data: {
      speciesCount: speciesCount,
      highlightedSpecies: {
        connect: highlightedTaxa.map((taxon) => ({ id: taxon.id })),
      },
    },
  })
}
