import { Prisma } from "@prisma/client"

import { INaturalistTaxa } from "@/types/inaturalist-taxa"
import { getOrCreateSourceInaturalistById } from "@/lib/database/populate/get-or-create-source-inaturalist-by-id"
import prisma from "@/lib/prisma"

export const getOrCreateTaxaById = async (taxaId: number) => {
  // 1. GET THE TAXA IF EXISTS

  const taxa = await prisma.taxa.findUnique({
    where: {
      id: taxaId,
    },
    include: {
      ancestors: true,
    },
  })

  const source = await prisma.source.findUnique({
    where: {
      sourceId_name_context_taxaId: {
        sourceId: taxaId.toString(),
        name: "inaturalist",
        context: "taxa_api",
        taxaId,
      },
    },
  })

  let inaturalist: INaturalistTaxa

  // 2. GET THE INATURALIST SOURCE

  // Check if sources is already linked
  if (source) {
    // If there is already a source, use it
    console.log(`Taxa ${taxaId} already has sources`)
    inaturalist = source.json as INaturalistTaxa
  } else {
    // Get the source data
    console.log(`Taxa ${taxaId} has no sources`)
    inaturalist = (await getOrCreateSourceInaturalistById(taxaId)).json
  }

  // 3. CHECK UP! RETURN THE TAXA IF IT ALREADY HAS ALL ANCESTORS (CUSTOM)

  if (taxa) {
    // 3.1 Check taxa has all the ancestors (with a custom query)
    // const ancestorsIds = (await getAncestors(taxaId)).map((ancestor) => ancestor.id)
    // if (JSON.stringify(inaturalist.ancestor_ids.sort()) === JSON.stringify(ancestorsIds.sort())) {
    //   console.log(`Taxa ${taxaId} exists and already has all ancestors`)
    //   return taxa
    // }

    // 3.2 Check taxa has all the ancestors with ancestors field
    let hasAllAncestors = false
    const ancestorsIds = taxa.ancestors.map((ancestor) => ancestor.id)
    if (JSON.stringify(inaturalist.ancestor_ids.sort()) === JSON.stringify(ancestorsIds.sort())) {
      console.log(`Taxa ${taxaId} exists and already has all ancestors`)
      hasAllAncestors = true
    }

    // 3.3 Check inaturalist fields are the same as the taxa fields
    let hasSameFields = false
    const scientificName = inaturalist.names
      .find((name) => name.is_valid && name.lexicon === "scientific-names")
      ?.name.toLowerCase()
    if (
      scientificName === taxa.scientificName &&
      inaturalist.rank === taxa.rank &&
      inaturalist.rank_level === taxa.rankLevel &&
      inaturalist.parent_id === taxa.parentId
    ) {
      console.log(`Taxa ${taxaId} exists and has the same fields`)
      hasSameFields = true
    }

    if (hasAllAncestors && hasSameFields) {
      return taxa
    }
  }

  // 4. CREATE PARENT IF EXISTS

  // Create/update parent if it exists
  let parentId = inaturalist.parent_id
  let parent

  // 4.1 If parent already exists and linked to the taxa, return the taxa
  if (parentId && taxa && taxa.parentId !== parentId) {
    return taxa
  }

  // 4.2 Create the parent if it doesn't exist
  if (parentId) {
    console.log(`Add parent id: ${parentId}`)
    parent = await getOrCreateTaxaById(parentId)
  }

  // 5. CREATE TAXA

  // 5.1 Get information from inaturalist
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
  if (!scientificName) throw new Error(`No scientific name found for taxa ${taxaId}`)

  const newTaxaObject: Prisma.TaxaCreateInput = {
    id: taxaId,
    scientificName,
    commonNames,
    rank: inaturalist.rank,
    rankLevel: inaturalist.rank_level,
    ...(parentId && {
      parent: {
        connect: {
          id: parentId,
        },
      },
    }),
    ancestors: {
      connect: [
        ...(parent
          ? [
              ...parent.ancestors.map((ancestor) => ({ id: ancestor.id })), // Add parent ancestors
              { id: parent.id }, // Add parent
            ]
          : []),
      ],
    },
    attributes: {
      connectOrCreate: {
        where: {
          taxaId,
        },
        create: {},
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
      ...newTaxaObject,
    },
    include: {
      ancestors: true,
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
