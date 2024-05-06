import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const groups = await prisma.group.findMany({
    include: {
      highLevelTaxa: true,
    },
  })

  console.log("Update group with species count and highlighted species")
  for (const [index, group] of groups.entries()) {
    console.log(`processing group ${index + 1} / ${groups.length}, id: ${group.slug}`)

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

    await prisma.group.update({
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

  return new Response()
}
