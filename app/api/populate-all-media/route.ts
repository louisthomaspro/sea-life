import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const taxaData = await prisma.taxa.findMany({
    select: {
      id: true,
    },
    orderBy: {
      id: "asc",
    },
  })

  for (const [indexTaxa, valueTaxa] of taxaData.entries()) {
    console.log(`processing taxa ${indexTaxa + 1} / ${taxaData.length}, id: ${valueTaxa.id}`)

    await fetch(`http://localhost:3000/api/populate-media/${valueTaxa.id}`)
  }

  return new Response()
}
