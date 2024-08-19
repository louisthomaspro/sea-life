import { Prisma } from "@prisma/client"

import prisma from "@/lib/prisma"

export const searchSpecies = async ({
  colors,
  pattern,
  region,
  caudal_fin_shape,
  body_shape,
}: {
  colors?: string[]
  pattern?: string
  region?: string
  caudal_fin_shape?: string
  body_shape?: string
}) => {
  const filters = []

  if (colors?.length) {
    filters.push("(" + colors.map((color) => `'${color}' = ANY(a."colors")`).join(" AND ") + ")")
  }

  if (caudal_fin_shape) {
    filters.push(`a."caudalFinShape" = '${caudal_fin_shape}'`)
  }

  if (pattern) {
    filters.push(`'${pattern}' = ANY(a."patterns")`)
  }

  if (region) {
    filters.push(`'${region}' = ANY(a."regions")`)
  }

  if (body_shape) {
    filters.push(`a."bodyShape" = '${body_shape}'`)
  }

  let filterQuery: Prisma.Sql = Prisma.raw("")
  if (filters.length) {
    filterQuery = Prisma.raw(`WHERE ${filters.join(" AND ")}`)
  }

  const query = Prisma.sql`
SELECT
    t."id" AS taxa_id,
    t."scientificName",
    t."commonNames",
    a."caudalFinShape" as "caudal_fin_shape",
    a."colors",
    a."regions",
    a."patterns",
    a."sociability",
    a."bodyShape" as "body_shape",
    tm."url" AS url
FROM
    "Taxa" t

    INNER JOIN "Attributes" a ON t."id" = a."taxaId"
    LEFT JOIN "TaxaMedia" tm ON t."id" = tm."taxaId" AND tm.position = 1

    ${filterQuery}
  `

  const searchResults = await prisma.$queryRaw<any[]>(query)

  return searchResults
}
