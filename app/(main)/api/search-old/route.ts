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

  const query = Prisma.sql`
  SELECT
  t.id,
  t."scientificName",
  t."commonNames",
m.url,
rank_scientific_name,
rank_common_names,
similarity_scientific_name,
similarity_common_names,
similarity

FROM
"Taxa" t INNER JOIN (
    SELECT DISTINCT ON (m."taxaId") m.*
    FROM "TaxaMedia" m
) m ON t.id = m."taxaId",
to_tsvector(t."scientificName" || t."commonNames"::TEXT) document,
to_tsquery(${termQuery} || ':*') query,
NULLIF(ts_rank(to_tsvector(t."scientificName"), query), 0) rank_scientific_name,
NULLIF(ts_rank(to_tsvector(t."commonNames"::TEXT), query), 0) rank_common_names,
SIMILARITY(${term}, t."scientificName") similarity_scientific_name,
SIMILARITY(${term}, t."commonNames"::TEXT) similarity_common_names,
SIMILARITY(${term}, t."scientificName" || t."commonNames"::TEXT) similarity

WHERE (query @@ document OR similarity_scientific_name > 0)
and t."rank" = 'species'

GROUP BY
t.id,
m.url,
rank_scientific_name,
rank_common_names,
similarity_scientific_name,
similarity_common_names,
similarity

ORDER BY
rank_scientific_name DESC NULLS LAST,
rank_common_names DESC NULLS LAST,
similarity_scientific_name DESC NULLS LAST,
similarity_common_names DESC NULLS LAST,
similarity DESC NULLS LAST

LIMIT 10
  `

  const searchResults = await prisma.$queryRaw<SearchResult[]>(query)

  return Response.json(searchResults)
}
