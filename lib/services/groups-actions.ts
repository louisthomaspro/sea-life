"use server"

import { Prisma } from "@prisma/client"

import { populateGroupById } from "@/lib/database/populate/populate-group-by-slug"
import prisma from "@/lib/prisma"

export const getGroupsAction = async () => {
  return prisma.group.findMany()
}

export const createGroupAction = async (values: Prisma.GroupCreateInput) => {
  const speciesCount = await prisma.taxa.count({
    where: {
      rank: "species",
      ancestors: {
        some: {
          id: {
            in: (values.highLevelTaxa?.connect as any)?.map((taxon: any) => taxon.id),
          },
        },
      },
    },
  })

  values.speciesCount = speciesCount

  const group = await prisma.group.create({
    data: values,
  })

  await populateGroupById(group.id)

  return true
}

export const updateGroupAction = async (id: number, values: Prisma.GroupUpdateInput) => {
  return prisma.group.update({
    where: {
      id,
    },
    data: values,
  })
}

export const deleteGroupAction = async (id: number) => {
  return prisma.list.delete({
    where: {
      id,
    },
  })
}
