// inport json backup.json
import jsonBackup from "@/backups/firestore-backup-species.json"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  console.log("Update species attributes")

  // Create or update attributes
  const attributes = [
    {
      id: "rarity",
      definition: `The rarity of a species in the wild. Values: ["uncommon","abundant","common","rare"]`,
      valueType: "string",
    },
    {
      id: "primary_habitats",
      definition: `The primary habitats of a species. Values: ["reef","open_sea","sandy_muddy_seafloor","seafloor","seagrass_algae","sandy_seafloor","terrestrial","coastal_zone","sandy_silty_seafloor","stagnant_water","beach"]`,
      valueType: "string[]",
    },
    {
      id: "secondary_habitats",
      definition: `The secondary habitats of a species. Values: ["sheltered_zone","current","cavity_crevices","overhanging","surface","corals"]`,
      valueType: "string[]",
    },
    {
      id: "depth_min",
      definition: `The minimum depth of a species in meters.`,
      valueType: "number",
    },
    {
      id: "depth_max",
      definition: `The maximum depth of a species in meters.`,
      valueType: "number",
    },
    {
      id: "regions",
      definition: `The regions where a species can be found. Values: ["indian-ocean","tropical-pacific","mediterranean-sea","temperate-atlantic","tropical-atlantic"]`,
      valueType: "string[]",
    },
    {
      id: "sociability",
      definition: `The sociability of a species. Values: ["solitary","group","schooling","couple"]`,
      valueType: "string",
    },
    {
      id: "max_length",
      definition: `The maximum length of a species in centimeters.`,
      valueType: "number",
    },
    {
      id: "common_length",
      definition: `The common length of a species in centimeters.`,
      valueType: "number",
    },
    {
      id: "common_plume_diameter",
      definition: `The common plume diameter of a species in centimeters.`,
      valueType: "number",
    },
    {
      id: "max_colony_size",
      definition: `The maximum colony size of a species in centimeters.`,
      valueType: "number",
    },
    {
      id: "max_polyp_diameter",
      definition: `The maximum polyp diameter of a species in centimeters.`,
      valueType: "number",
    },
    {
      id: "common_diameter",
      definition: `The common diameter of a species in centimeters.`,
      valueType: "number",
    },
  ]

  for (const attribute of attributes) {
    await prisma.attribute.upsert({
      where: { id: attribute.id },
      update: {
        definition: attribute.definition,
        valueType: attribute.valueType,
      },
      create: attribute,
    })
  }

  // Update species attributes

  let count = 1
  for (const value in jsonBackup) {
    console.log(`processing species ${count} / ${Object.keys(jsonBackup).length}`)
    count++

    const speciesInfo = (jsonBackup as any)[value]

    await prisma.taxa.update({
      where: { id: Number(speciesInfo.external_ids.inaturalist) },
      data: {
        attributes: {
          connectOrCreate: [
            ...(speciesInfo.rarity
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "rarity" } },
                      value: speciesInfo.rarity,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "rarity",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.regions
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "regions" } },
                      value: speciesInfo.regions,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "regions",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.habitats_1
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "primary_habitats" } },
                      value: speciesInfo.habitats_1,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "primary_habitats",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.habitats_2
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "secondary_habitats" } },
                      value: speciesInfo.habitats_2,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "secondary_habitats",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.depth_min
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "depth_min" } },
                      value: speciesInfo.depth_min,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "depth_min",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.depth_max
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "depth_max" } },
                      value: speciesInfo.depth_max,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "depth_max",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.sociability
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "sociability" } },
                      value: speciesInfo.sociability,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "sociability",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.max_length
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "max_length" } },
                      value: speciesInfo.max_length,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "max_length",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.common_length
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "common_length" } },
                      value: speciesInfo.common_length,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "common_length",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.common_plume_diameter
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "common_plume_diameter" } },
                      value: speciesInfo.common_plume_diameter,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "common_plume_diameter",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.max_colony_size
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "max_colony_size" } },
                      value: speciesInfo.max_colony_size,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "max_colony_size",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.max_polyp_diameter
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "max_polyp_diameter" } },
                      value: speciesInfo.max_polyp_diameter,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "max_polyp_diameter",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.common_diameter
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "common_diameter" } },
                      value: speciesInfo.common_diameter,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "common_diameter",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.common_diameter
              ? [
                  {
                    create: {
                      attribute: { connect: { id: "common_diameter" } },
                      value: speciesInfo.common_diameter,
                    },
                    where: {
                      taxaId_attributeId: {
                        attributeId: "common_diameter",
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
          ],
        },
      },
    })
  }
  return Response.json("done")
}
