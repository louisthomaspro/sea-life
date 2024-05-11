"use server"

import { Prisma } from "@prisma/client"

import { populateGroupById } from "@/lib/database/populate/populate-group-by-slug"
import prisma from "@/lib/prisma"

export const getGroupsAction = async () => {
  return prisma.group.findMany()
}

export const createGroupAction = async (values: Prisma.GroupCreateInput) => {
  const group = await prisma.group.create({
    data: values,
  })

  await populateGroupById(group.id)

  return true
}

export const updateGroupAction = async (id: number, values: Prisma.GroupUpdateInput) => {
  const group = await prisma.group.update({
    where: {
      id,
    },
    data: values,
  })

  await populateGroupById(group.id)

  return true
}

export const deleteGroupAction = async (id: number) => {
  return prisma.list.delete({
    where: {
      id,
    },
  })
}
