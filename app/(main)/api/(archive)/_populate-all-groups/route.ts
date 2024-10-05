import { groups } from "@/backups/groups"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  for (const [indexGroup, valueGroup] of groups.entries()) {
    console.log(`processing group ${indexGroup + 1} / ${groups.length}, id: ${valueGroup.id}`)

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
