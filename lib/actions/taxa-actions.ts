import { Prisma } from "@prisma/client"

import { INaturalistTaxa } from "@/types/inaturalist-taxa"
import { getOrCreateSourceInaturalist } from "@/lib/actions/source-inaturalist-actions"
import prisma from "@/lib/prisma"

export const getOrCreateTaxaById = async (taxaId: number) => {
  // Get taxa
  const taxa = await prisma.taxa.findUnique({
    where: {
      id: taxaId,
    },
  })

  // Get the source data
  const sourceInaturalist = await getOrCreateSourceInaturalist(taxaId)
  const inaturalist = sourceInaturalist.json as unknown as INaturalistTaxa

  // Check if this taxa exists and has all the ancestors
  if (taxa) {
    const ancestorsIds = (await getAncestors(taxaId)).map((ancestor) => ancestor.id)

    if (JSON.stringify(inaturalist.ancestor_ids.sort()) === JSON.stringify(ancestorsIds.sort())) {
      console.log(`Taxa ${taxaId} exists and already has all ancestors`)
      return taxa
    }
  }

  // Create/update parent if it exists
  let parentId = inaturalist.parent_id
  if (parentId) {
    console.log(`Add parent id: ${parentId}`)
    await getOrCreateTaxaById(parentId)

    // Check if the parent is already linked to the existing taxa
    if (taxa && taxa.parentId === parentId) {
      console.log(`Taxa is already linked to parent ${parentId}`)
      return taxa
    }
  }

  // Create the taxa
  console.log(`${taxa ? "Update" : "Create"} taxa ${taxaId}`)
  let scientificName = null
  const commonNames: any = {}
  inaturalist.names.forEach((name) => {
    if (name.is_valid) {
      if (name.lexicon === "scientific-names") {
        scientificName = name.name.toLowerCase()
      } else {
        commonNames[name.locale] = (commonNames[name.locale] ?? []).concat(name.name)
      }
    }
  })

  const newTaxaObject = {
    scientificName,
    commonNames,
    rank: inaturalist.rank,
    rankLevel: inaturalist.rank_level,
    parentId: parentId,
    externalIds: {
      connectOrCreate: {
        create: {
          externalId: taxaId.toString(),
          source: "inaturalist",
        },
        where: {
          taxaId_externalId: {
            externalId: taxaId.toString(),
            taxaId: taxaId,
          },
        },
      },
    },
  }

  const newTaxa = await prisma.taxa.upsert({
    where: {
      id: taxaId,
    },
    update: {
      ...newTaxaObject,
    },
    create: {
      id: taxaId,
      ...newTaxaObject,
    },
  })

  return newTaxa
}

export const getAncestors = async (taxaId: number, includeSelf = false) => {
  try {
    const includeSelfCondition = Prisma.sql`WHERE id <> ${taxaId}`
    const result = await prisma.$queryRaw<any[]>`
      WITH RECURSIVE TaxaAncestors AS (
        SELECT "id", "parentId", "scientificName", "rank", "rankLevel"
        FROM taxa
        WHERE id = ${taxaId}
      
        UNION
      
        SELECT t."id", t."parentId", t."scientificName", t."rank", t."rankLevel"
        FROM taxa t
        JOIN TaxaAncestors a ON t.id = a."parentId"
      )
      SELECT * FROM TaxaAncestors ${includeSelf ? Prisma.empty : includeSelfCondition} ORDER BY "rankLevel" DESC
    `

    return result
  } catch (error) {
    console.error(error)
    throw error // Propagate the error if needed
  } finally {
    await prisma.$disconnect()
  }
}
