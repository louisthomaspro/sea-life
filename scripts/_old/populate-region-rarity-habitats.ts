import backup from "@/backups/firestore-backup-species.json"

import prisma from "@/lib/prisma"

/**
 * Populate region, rarity, primary, secondary habitats, depth, sociability, sizes, maxColonySize, maxPolypDiameter
 */

async function mainBatch() {
  let i = 0
  for (const taxa in backup) {
    const id = Number((backup as any)[taxa].external_ids.inaturalist)
    if (id) {
      await prisma.attributes.update({
        where: {
          taxaId: id,
        },
        data: {
          regions: {
            set: (backup as any)[taxa].regions ?? [],
          },
          rarity: {
            set: (backup as any)[taxa].rarity ?? null,
          },
          primaryHabitats: {
            set: (backup as any)[taxa].habitats_1 ?? [],
          },
          secondaryHabitats: {
            set: (backup as any)[taxa].habitats_2 ?? [],
          },
          depthMax: (backup as any)[taxa].depth_max ?? null,
          depthMin: (backup as any)[taxa].depth_min ?? null,
          sociability: (backup as any)[taxa].sociability ?? null,
          maxLength: (backup as any)[taxa].sizes?.max_length ?? null,
          commonLength: (backup as any)[taxa].sizes?.common_length ?? null,
          commonDiameter: (backup as any)[taxa].sizes?.common_diameter ?? null,
          commonPlumeDiameter: (backup as any)[taxa].sizes?.common_plume_diameter ?? null,
          maxColonySize: (backup as any)[taxa].sizes?.max_colony_size ?? null,
          maxPolypDiameter: (backup as any)[taxa].sizes?.max_polyp_diameter ?? null,
        },
      })
      i++
      console.log(`Updated ${i} species`, Object.keys(backup).length - i, "remaining")
    } else {
      console.log("No external id found for", taxa)
    }
  }
}

mainBatch()
