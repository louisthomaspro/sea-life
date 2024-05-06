"use server"

import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export const getListAction = async (id: number) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  return prisma.list.findFirst({
    where: {
      id,
      ownerId: user.id,
    },
    include: {
      species: {
        include: {
          taxa: {
            include: {
              medias: {
                take: 1,
              },
            },
          },
        },
      },
    },
  })
}

export const getListsAction = async (speciesId?: number) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const [lists, counts] = await prisma.$transaction([
    prisma.list.findMany({
      where: {
        ownerId: user.id,
      },
      include: {
        _count: {
          select: {
            species: {
              where: speciesId ? { taxaId: speciesId } : {},
            },
          },
        },
        species: {
          include: {
            taxa: {
              include: {
                medias: {
                  take: 1,
                },
              },
            },
          },
          take: 4,
        },
      },
    }),
    prisma.list.findMany({
      where: {
        ownerId: user.id,
      },
      include: {
        _count: {
          select: {
            species: true,
          },
        },
      },
    }),
  ])

  const mergedCount = lists.map((list, index) => ({
    ...list,
    speciesCount: counts[index]._count,
  }))

  return mergedCount
}

export const createListAction = async (name: string) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  return prisma.list.create({
    data: {
      name,
      ownerId: user.id,
    },
  })
}

export const updateListAction = async (id: number, name: string) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const list = await prisma.list.findFirst({
    where: {
      id,
      ownerId: user.id,
    },
  })

  if (!list) {
    throw new Error("List not found")
  }

  return prisma.list.update({
    where: {
      id: list.id,
    },
    data: {
      name,
    },
  })
}

export const deleteListAction = async (id: number) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const list = await prisma.list.findFirst({
    where: {
      id,
      ownerId: user.id,
    },
  })

  if (!list) {
    throw new Error("List not found")
  }

  return prisma.list.delete({
    where: {
      id: list.id,
    },
  })
}

export const addToListAction = async (listId: number, speciesId: number) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const list = await prisma.list.findFirst({
    where: {
      id: listId,
      ownerId: user.id,
    },
  })

  if (!list) {
    throw new Error("List not found")
  }

  return prisma.listToSpecies.upsert({
    where: {
      listId_taxaId: {
        listId,
        taxaId: speciesId,
      },
    },
    create: {
      listId,
      taxaId: speciesId,
    },
    update: {},
  })
}

export const deleteFromListAction = async (listId: number, speciesId: number) => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not found")
  }

  const list = await prisma.list.findFirst({
    where: {
      id: listId,
      ownerId: user.id,
    },
  })

  if (!list) {
    throw new Error("List not found")
  }

  return prisma.listToSpecies.delete({
    where: {
      listId_taxaId: {
        listId,
        taxaId: speciesId,
      },
    },
  })
}
