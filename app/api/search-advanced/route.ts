import { Prisma } from "@prisma/client"

import prisma from "@/lib/prisma"

export type SearchResult = {
  id: string
  scientificName: string
  commonNames: {
    [key: string]: string[]
  }
  url: string
  caudal_fin_shape: string
  body_shape: string
  colors: string[]
  regions: string[]
  patterns: string[]
}

export interface RequestBody {
  colors?: string[]
  pattern?: string
  region?: string
  caudal_fin_shape?: string
  body_shape?: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody

  console.log(`Searching...`)

  const filters = []

  if (body.colors?.length) {
    filters.push("(" + body.colors.map((color) => `colors @> '["${color}"]'::jsonb`).join(" AND ") + ")")
  }

  if (body.caudal_fin_shape) {
    filters.push(`caudal_fin_shape::text LIKE '%${body.caudal_fin_shape}%'`)
  }

  if (body.pattern) {
    filters.push(`patterns @> '["${body.pattern}"]'::jsonb`)
  }

  if (body.region) {
    filters.push(`regions @> '["${body.region}"]'::jsonb`)
  }

  if (body.body_shape) {
    filters.push(`body_shape::text LIKE '%${body.body_shape}%'`)
  }

  console.log(filters)

  let filterQuery: Prisma.Sql = Prisma.raw("")
  if (filters.length) {
    filterQuery = Prisma.raw(`WHERE ${filters.join(" AND ")}`)
  }

  const query = Prisma.sql`
  WITH fishes as (SELECT
    t."id" AS taxa_id,
    t."scientificName",
    t."commonNames",
    caudal_fin_shape.value AS caudal_fin_shape,
    colors.value AS colors,
    regions.value AS regions,
    patterns.value AS patterns,
    body_shape.value AS body_shape,
    tm."url" AS url
FROM
    "Taxa" t

LEFT JOIN "TaxaMedia" tm ON t."id" = tm."taxaId" AND tm.position = 1
LEFT JOIN (
    SELECT
        a."taxaId",
        a."value"
    FROM
        "Attribute" a
    JOIN
        "AttributeDefinition" ad ON a."attributeDefinitionId" = ad."id"
    WHERE
        ad."id" = 'caudal_fin_shape'
) caudal_fin_shape ON t."id" = caudal_fin_shape."taxaId"

LEFT JOIN (
    SELECT
        a."taxaId",
        a."value"
    FROM
        "Attribute" a
    JOIN
        "AttributeDefinition" ad ON a."attributeDefinitionId" = ad."id"
    WHERE
        ad."id" = 'colors'
) colors ON t."id" = colors."taxaId"

LEFT JOIN (
    SELECT
        a."taxaId",
        a."value"
    FROM
        "Attribute" a
    JOIN
        "AttributeDefinition" ad ON a."attributeDefinitionId" = ad."id"
    WHERE
        ad."id" = 'regions'
) regions ON t."id" = regions."taxaId"

LEFT JOIN (
    SELECT
        a."taxaId",
        a."value"
    FROM
        "Attribute" a
    JOIN
        "AttributeDefinition" ad ON a."attributeDefinitionId" = ad."id"
    WHERE
        ad."id" = 'patterns'
) patterns ON t."id" = patterns."taxaId"

LEFT JOIN (
    SELECT
        a."taxaId",
        a."value"
    FROM
        "Attribute" a
    JOIN
        "AttributeDefinition" ad ON a."attributeDefinitionId" = ad."id"
    WHERE
        ad."id" = 'sociability'
) sociability ON t."id" = sociability."taxaId"

LEFT JOIN (
    SELECT
        a."taxaId",
        a."value"
    FROM
        "Attribute" a
    JOIN
        "AttributeDefinition" ad ON a."attributeDefinitionId" = ad."id"
    WHERE
        ad."id" = 'body_shape'
    ) body_shape ON t."id" = body_shape."taxaId"

    JOIN "_Ancestors" anc ON t.id = anc."A"

    WHERE anc."B" = 47178 AND t.rank = 'species'

    )

    SELECT * FROM fishes

    ${filterQuery}
  `

  const searchResults = await prisma.$queryRaw<any[]>(query)

  return Response.json(searchResults)
}
