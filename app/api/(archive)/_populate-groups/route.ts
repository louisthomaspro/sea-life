import { groups } from "@/constants/groups"

import { INaturalistTaxa } from "@/types/inaturalist-taxa"
import { uploadTaxaMedia } from "@/lib/aws/s3-utils"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  for (const [indexGroup, valueGroup] of groups.entries()) {
    console.log(`processing group ${indexGroup + 1} / ${groups.length}, id: ${valueGroup.id}`)

    const highlightedTaxa = await prisma.taxa.findMany({
      take: 4,
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
              in: valueGroup.includesTaxa,
            },
          },
        },
      },
    })

    let level = 0
    if (valueGroup.showSpecies) {
      level = 2
    }
    if (valueGroup.parentId === "fauna" || valueGroup.parentId === "flora") {
      level = 1
    }

    await prisma.group.create({
      data: {
        slug: valueGroup.id,
        commonNames: valueGroup.title,
        subtitle: valueGroup.subtitle,
        level: level,
        highLevelTaxa: {
          connect: valueGroup.includesTaxa.map((taxonId) => ({ id: taxonId })),
        },
        highlightedSpecies: {
          connect: highlightedTaxa.map((taxon) => ({ id: taxon.id })),
        },
      },
    })
  }

  console.log("linking parentid")
  for (const [indexGroup, valueGroup] of groups.entries()) {
    console.log(`processing group ${indexGroup + 1} / ${groups.length}, id: ${valueGroup.id}`)

    if (!valueGroup.parentId) {
      console.log(`Group ${valueGroup.id} has no parent`)
      continue
    }

    const group = await prisma.group.findFirst({
      where: {
        slug: valueGroup.id,
      },
    })

    const parentGroup = await prisma.group.findFirst({
      where: {
        slug: valueGroup.parentId,
      },
    })

    if (!group || !parentGroup) {
      console.error(`Group ${valueGroup.id} or parent ${valueGroup.parentId} not found`)
      continue
    }

    await prisma.group.update({
      where: {
        id: group.id,
      },
      data: {
        parent: {
          connect: {
            id: parentGroup.id,
          },
        },
      },
    })
  }

  return new Response()
}
