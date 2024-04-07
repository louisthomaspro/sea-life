import prisma from "@/lib/prisma"

export const getSpeciesByParentList = async (parentList: number[]) => {
  const species = await prisma.taxa.findMany({
    where: {
      parentId: {
        in: parentList,
      },
      rank: "species",
    },
  })

  return species
}
