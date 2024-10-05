import OpenAI from "openai"

import prisma from "@/lib/prisma"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * 
 * @param request {
    type: 'UPDATE',
    table: 'Taxa',
    record: {
      id: 47239,
      rank: 'species',
      parentId: 47243,
      createdAt: '2024-05-04T06:41:12.88+00:00',
      rankLevel: 10,
      updatedAt: '2024-05-04T06:41:12.88+00:00',
      commonNames: [Object],
      scientificName: 'aulostomus chinensis',
      morphologicalDescription: 'tes',
      embeddingMorphologicalDescription: null
    },
    schema: 'public',
    old_record: {
      id: 47239,
      rank: 'species',
      parentId: 47243,
      createdAt: '2024-05-04T06:41:12.88+00:00',
      rankLevel: 10,
      updatedAt: '2024-05-04T06:41:12.88+00:00',
      commonNames: [Object],
      scientificName: 'aulostomus chinensis',
      morphologicalDescription: 'test',
      embeddingMorphologicalDescription: null
    }
  }
 */

export async function POST(request: Request) {
  const body = await request.json()
  console.log("Getting species", body.record.id)

  if (body.record.morphologicalDescription === body.old_record.morphologicalDescription) {
    return new Response("No change in description", { status: 200 })
  }

  const taxaId = body.record.id
  const description = body.record.morphologicalDescription

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: description,
    encoding_format: "float",
  })

  const [{ embedding }] = embeddingResponse.data
  // const vectorQuery = `[${embedding.join(",")}]`

  await prisma.$executeRaw`
    UPDATE "Taxa"
    SET "embeddingMorphologicalDescription" = ${JSON.stringify(embedding)}::vector
    WHERE "id" = ${taxaId}
      `

  return new Response("Embedding updated", { status: 200 })
}
