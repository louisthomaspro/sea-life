import { Prisma, Taxa } from "@prisma/client"

import { openai } from "@/lib/openai"
import prisma from "@/lib/prisma"

// export type SearchResult = Taxa & {
//   url: string
//   rank_scientific_name: number
//   rank_common_names: number
//   similarity_scientific_name: number
//   similarity_common_names: number
//   similarity: number
// }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const term = searchParams.get("term") || ""

  console.log(`Searching... ${term}`)

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: term,
    encoding_format: "float",
  })

  const [{ embedding }] = embeddingResponse.data

  const vectorQuery = `[${embedding.join(",")}]`

  const query = Prisma.sql`
  SELECT
  t.id,
  t."scientificName",
  t."commonNames",
  m.url,
   1 - (t."embeddingMorphologicalDescription"::vector <=> ${vectorQuery}::vector) as similarity
  FROM
  "Taxa" t INNER JOIN (
      SELECT DISTINCT ON (m."taxaId") m.*
      FROM "TaxaMedia" m
  ) m ON t.id = m."taxaId"

    WHERE (t."embeddingMorphologicalDescription"::vector <=> ${vectorQuery}::vector) < 1 - .5
    AND t."rank" = 'species'
     ORDER BY (t."embeddingMorphologicalDescription"::vector <=> ${vectorQuery}::vector)

  LIMIT 10
  `

  const searchResults = await prisma.$queryRaw<any[]>(query)

  return Response.json(searchResults)
}
