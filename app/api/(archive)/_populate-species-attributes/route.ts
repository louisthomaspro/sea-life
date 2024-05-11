// inport json backup.json
import jsonBackup from "@/backups/firestore-backup-species.json"
import { AttributeEnum } from "@prisma/client"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  console.log("Update species attributes")

  // Create or update attributes
  const attributes = [
    {
      id: AttributeEnum.rarity,
      definition: `The rarity of a species in the wild. Values: ["uncommon","abundant","common","rare"]`,
      valueType: "string",
    },
    {
      id: AttributeEnum.primary_habitats,
      definition: `The primary habitats of a species. Values: ["reef","open_sea","sandy_muddy_seafloor","seafloor","seagrass_algae","sandy_seafloor","terrestrial","coastal_zone","sandy_silty_seafloor","stagnant_water","beach"]`,
      valueType: "string[]",
    },
    {
      id: AttributeEnum.secondary_habitats,
      definition: `The secondary habitats of a species. Values: ["sheltered_zone","current","cavity_crevices","overhanging","surface","corals"]`,
      valueType: "string[]",
    },
    {
      id: AttributeEnum.depth_min,
      definition: `The minimum depth of a species in meters.`,
      valueType: "number",
    },
    {
      id: AttributeEnum.depth_max,
      definition: `The maximum depth of a species in meters.`,
      valueType: "number",
    },
    {
      id: AttributeEnum.regions,
      definition: `The regions where a species can be found. Values: ["indian-ocean","tropical-pacific","mediterranean-sea","temperate-atlantic","tropical-atlantic"]`,
      valueType: "string[]",
    },
    {
      id: AttributeEnum.sociability,
      definition: `The sociability of a species. Values: ["solitary","group","schooling","couple"]`,
      valueType: "string",
    },
    {
      id: AttributeEnum.max_length,
      definition: `The maximum length of a species in centimeters.`,
      valueType: "number",
    },
    {
      id: AttributeEnum.common_length,
      definition: `The common length of a species in centimeters.`,
      valueType: "number",
    },
    {
      id: AttributeEnum.common_plume_diameter,
      definition: `The common plume diameter of a species in centimeters.`,
      valueType: "number",
    },
    {
      id: AttributeEnum.max_colony_size,
      definition: `The maximum colony size of a species in centimeters.`,
      valueType: "number",
    },
    {
      id: AttributeEnum.max_polyp_diameter,
      definition: `The maximum polyp diameter of a species in centimeters.`,
      valueType: "number",
    },
    {
      id: AttributeEnum.common_diameter,
      definition: `The common diameter of a species in centimeters.`,
      valueType: "number",
    },
  ]

  for (const attribute of attributes) {
    await prisma.attributeDefinition.upsert({
      where: { id: attribute.id as AttributeEnum },
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
                      attributeDefinition: { connect: { id: AttributeEnum.rarity } },
                      value: speciesInfo.rarity,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.rarity,
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
                      attributeDefinition: { connect: { id: AttributeEnum.regions } },
                      value: speciesInfo.regions,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.regions,
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
                      attributeDefinition: { connect: { id: AttributeEnum.primary_habitats } },
                      value: speciesInfo.habitats_1,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.primary_habitats,
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
                      attributeDefinition: { connect: { id: AttributeEnum.secondary_habitats } },
                      value: speciesInfo.habitats_2,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.secondary_habitats,
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
                      attributeDefinition: { connect: { id: AttributeEnum.depth_min } },
                      value: speciesInfo.depth_min,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.depth_min,
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
                      attributeDefinition: { connect: { id: AttributeEnum.depth_max } },
                      value: speciesInfo.depth_max,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.depth_max,
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
                      attributeDefinition: { connect: { id: AttributeEnum.sociability } },
                      value: speciesInfo.sociability,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.sociability,
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.sizes.max_length
              ? [
                  {
                    create: {
                      attributeDefinition: { connect: { id: AttributeEnum.max_length } },
                      value: speciesInfo.sizes.max_length,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.max_length,
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.sizes.common_length
              ? [
                  {
                    create: {
                      attributeDefinition: { connect: { id: AttributeEnum.common_length } },
                      value: speciesInfo.sizes.common_length,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.common_length,
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.sizes.common_plume_diameter
              ? [
                  {
                    create: {
                      attributeDefinition: { connect: { id: AttributeEnum.common_plume_diameter } },
                      value: speciesInfo.sizes.common_plume_diameter,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.common_plume_diameter,
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.sizes.max_colony_size
              ? [
                  {
                    create: {
                      attributeDefinition: { connect: { id: AttributeEnum.max_colony_size } },
                      value: speciesInfo.sizes.max_colony_size,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.max_colony_size,
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.sizes.max_polyp_diameter
              ? [
                  {
                    create: {
                      attributeDefinition: { connect: { id: AttributeEnum.max_polyp_diameter } },
                      value: speciesInfo.sizes.max_polyp_diameter,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.max_polyp_diameter,
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.sizes.common_diameter
              ? [
                  {
                    create: {
                      attributeDefinition: { connect: { id: AttributeEnum.common_diameter } },
                      value: speciesInfo.sizes.common_diameter,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.common_diameter,
                        taxaId: Number(speciesInfo.external_ids.inaturalist),
                      },
                    },
                  },
                ]
              : []),
            ...(speciesInfo.sizes.common_diameter
              ? [
                  {
                    create: {
                      attributeDefinition: { connect: { id: AttributeEnum.common_diameter } },
                      value: speciesInfo.sizes.common_diameter,
                    },
                    where: {
                      taxaId_attributeDefinitionId: {
                        attributeDefinitionId: AttributeEnum.common_diameter,
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
