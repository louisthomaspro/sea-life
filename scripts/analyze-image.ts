import { analyzeMediaByTaxaId } from "@/lib/database/populate/analyze-media-by-taxa-id"
import prisma from "@/lib/prisma"

require("dotenv").config()

/**
 * Analyze image and populate attributes like colors, pattern, description, etc.
 */

async function mainBatch() {
  const taxaData = await prisma.taxa.findMany({
    select: {
      id: true,
    },
    orderBy: {
      id: "asc",
    },
    take: 1,
  })

  const BATCH_SIZE = 10 // number of parallel executions
  for (let i = 0; i < taxaData.length; i += BATCH_SIZE) {
    const batch = taxaData.slice(i, i + BATCH_SIZE).map((valueTaxa, index) => {
      console.log(`processing taxa ${i + index + 1} / ${taxaData.length}, id: ${valueTaxa.id}`)
      return analyzeMediaByTaxaId(valueTaxa.id)
    })
    await Promise.all(batch)
  }
}

mainBatch()
