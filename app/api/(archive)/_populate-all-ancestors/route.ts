import { getOrCreateTaxaById } from "@/lib/database/populate/get-or-create-taxa-by-id"
import prisma from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const allTaxa = await prisma.taxa.findMany({
    select: {
      id: true,
    },
    where: {
      rank: {
        equals: "species",
      },
    },
    orderBy: {
      id: "asc",
    },
  })

  for (const [indexTaxa, valueTaxa] of allTaxa.entries()) {
    console.log(`processing taxa ${indexTaxa + 1} / ${allTaxa.length}, id: ${valueTaxa.id}`)
    const newTaxa = await getOrCreateTaxaById(valueTaxa.id)
    console.log(
      `newTaxa: ${valueTaxa.id}`,
      newTaxa.ancestors.map((ancestor) => ancestor.id)
    )
  }

  return Response.json("done")
}
