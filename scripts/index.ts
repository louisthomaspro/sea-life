import prisma from "@/lib/prisma"

import backup from "./backup-group.json"

const newArray = []

for (const [key, value] of Object.entries(backup)) {
  // value.includes is an array of scientific names. Find the ids of these taxa.
  const taxas = await prisma.taxa.findMany({
    select: {
      id: true,
      scientificName: true,
    },
    where: {
      scientificName: {
        in: value.includes,
      },
    },
  })
  const newIncludes = []
  for (const i of value.includes) {
    const taxa = taxas.find((taxa) => taxa.scientificName === i)
    if (taxa) {
      newIncludes.push(taxa.id)
    } else {
      console.log(`Taxa not found: ${i}`)
    }
  }

  newArray.push({
    id: key,
    parentId: value.parent_id,
    title: value.title,
    subtitle: (value as any).subtitle ?? {},
    showSpecies: (value as any).show_species ?? false,
    includesTaxa: newIncludes,
    photos: (value as any).photos ? (value as any).photos.map((photo: any) => photo.original_url) : [],
  })
}
console.log(JSON.stringify(newArray))
