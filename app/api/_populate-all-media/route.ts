import { populateMediaById } from "@/lib/database/populate/populate-media-by-id"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const START_FROM = 1000
  const taxaData = await prisma.taxa.findMany({
    skip: START_FROM,
    select: {
      id: true,
    },
    orderBy: {
      id: "asc",
    },
  })

  for (const [indexTaxa, valueTaxa] of taxaData.entries()) {
    console.log(`processing taxa ${indexTaxa + 1} / ${taxaData.length}, id: ${valueTaxa.id}`)
    let retryCount = 0
    const maxRetries = 2
    while (retryCount < maxRetries) {
      try {
        await populateMediaById(valueTaxa.id)
        break // If successful, exit the loop
      } catch (error) {
        console.error(`Error processing taxa ${indexTaxa + 1}, id: ${valueTaxa.id}`)
        console.error(error)
        retryCount++
      }
    }
  }

  return new Response()
}
