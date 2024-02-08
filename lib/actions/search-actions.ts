"use server"

import { type Taxa } from "@prisma/client"

import { openai } from "@/lib/openai"
import prisma from "@/lib/prisma"

export async function searchSpecies(query: string): Promise<Array<Taxa & { similarity: number }>> {
  try {
    if (query.trim().length === 0) return []

    const embedding = await generateEmbedding(query)
    const vectorQuery = `[${embedding.join(",")}]`
    const speciesResults = await prisma.$queryRaw`
      SELECT
        id,
        "scientific_name",
        "common_names",
        1 - (embedding <=> ${vectorQuery}::vector) as similarity
      FROM species
      WHERE 1 - (embedding <=> ${vectorQuery}::vector) > .5
      ORDER BY  similarity DESC
      LIMIT 8;
    `

    return speciesResults as Array<Taxa & { similarity: number }>
  } catch (error) {
    console.error("Error during searchSpecies", error)
    throw error
  }
}

export async function generateEmbedding(raw: string) {
  // OpenAI recommends replacing newlines with spaces for best results
  const input = raw.replace(/\n/g, " ")
  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  })

  const embeddingData = await embeddingResponse.json()
  const [{ embedding }] = embeddingData.data

  return embedding
}
