import { Prisma, Taxa } from "@prisma/client"

import prisma from "@/lib/prisma"

export type SearchResult = Taxa & {
  url: string
  rank_scientific_name: number
  rank_common_names: number
  similarity_scientific_name: number
  similarity_common_names: number
  similarity: number
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const term = searchParams.get("term") || ""
  const termQuery = term.replace(/\s/g, "&") // & means words can be in any order
  console.log(`Searching... ${term}`)

  const time = performance.now()

  const query = Prisma.sql`
  WITH ranked_taxa AS (
    SELECT
      t.id,
      t."scientificName",
      t."commonNameEn",
      t."commonNameFr",
      t."commonNames",
      ts_rank(to_tsvector('simple', t."scientificName"), query) AS rank_scientific_name,
      ts_rank(to_tsvector('simple', COALESCE(t."commonNameEn", '')), query) AS rank_common_name_en,
      ts_rank(to_tsvector('simple', COALESCE(t."commonNameFr", '')), query) AS rank_common_name_fr,
      GREATEST(
        SIMILARITY(${term}, t."scientificName"),
        SIMILARITY(${term}, COALESCE(t."commonNameEn", '')),
        SIMILARITY(${term}, COALESCE(t."commonNameFr", ''))
      ) AS similarity
    FROM
      "Taxa" t,
      to_tsquery('simple', ${termQuery} || ':*') query
    WHERE
      t."rank" = 'species'
      AND (
        to_tsvector('simple', t."scientificName") @@ query
        OR to_tsvector('simple', COALESCE(t."commonNameEn", '')) @@ query
        OR to_tsvector('simple', COALESCE(t."commonNameFr", '')) @@ query
        OR SIMILARITY(${term}, t."scientificName") > 0
        OR SIMILARITY(${term}, COALESCE(t."commonNameEn", '')) > 0
        OR SIMILARITY(${term}, COALESCE(t."commonNameFr", '')) > 0
      )
  )
  SELECT
    rt.*,
    m.url,
    rt.similarity AS similarity_scientific_name,
    rt.similarity AS similarity_common_name_en,
    rt.similarity AS similarity_common_name_fr
  FROM
    ranked_taxa rt
  INNER JOIN LATERAL (
    SELECT url
    FROM "TaxaMedia"
    WHERE "taxaId" = rt.id
    LIMIT 1
  ) m ON true
  ORDER BY
    COALESCE(rt.rank_scientific_name, 0) DESC,
    COALESCE(rt.rank_common_name_en, 0) DESC,
    COALESCE(rt.rank_common_name_fr, 0) DESC,
    rt.similarity DESC
  LIMIT 10
  `

  const searchResults = await prisma.$queryRaw<SearchResult[]>(query)

  const timeTaken = performance.now() - time
  console.log(`Time taken: ${Math.floor(timeTaken)} ms`)

  return Response.json(searchResults)
}
