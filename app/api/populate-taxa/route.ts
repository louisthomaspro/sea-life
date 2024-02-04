import { getOrCreateTaxaById } from "@/lib/actions/taxa-actions"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const taxaData = await prisma.taxa.findMany({
    select: {
      id: true,
      parentId: true,
      parent: true,
    },
    orderBy: {
      id: "asc",
    },
  })

  for (const [index, value] of taxaData.entries()) {
    console.log(`processing ${index + 1} / ${taxaData.length}, id: ${value.id}`)
    await getOrCreateTaxaById(value.id)
  }

  return new Response()
}
