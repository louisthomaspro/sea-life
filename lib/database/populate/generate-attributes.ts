import { AttributeEnum } from "@prisma/client"

import prisma from "@/lib/prisma"

export const colors = [
  "white",
  "brown",
  "yellow",
  "black",
  "blue",
  "orange",
  "dark-gray",
  "red",
  "green",
  "purple",
  "pink",
  "light-gray",
]
export const patterns = [
  "blotches-or-dots",
  "vertical-marking",
  "horizontal-marking",
  "reticulations-pattern",
  "oblique-markings",
  "streaks-pattern",
  "banded-pattern",
  "grid-pattern",
  "chevrons-pattern",
  "camouflage-pattern",
  "tubercles-pattern",
  "spines-pattern",
  "barbels-pattern",
  "none",
]
export const caudalFinShapes = ["rounded", "forked", "truncated", "pointed", "lunate"]
export const bodyShapes = [
  "fusiform",
  "compressed",
  "elongated",
  "globelike",
  "anguilliform",
  "flat",
  "rectangular",
  "other",
]

export const generateAttributes = async () => {
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
    // MORPHOLOGICAL ATTRIBUTES
    {
      id: AttributeEnum.colors,
      definition: `The colors of a species. Values: ["${colors.join(", ")}"]`,
      valueType: "string",
    },
    {
      id: AttributeEnum.patterns,
      definition: `The patterns of a species. Values: ["${patterns.join(", ")}"]`,
      valueType: "string",
    },
    {
      id: AttributeEnum.caudal_fin_shape,
      definition: `The shape of the caudal fin of a species. Values: ["${caudalFinShapes.join(", ")}"]`,
      valueType: "string",
    },
    {
      id: AttributeEnum.body_shape,
      definition: `The shape of the body of a species. Values: ["${bodyShapes.join(", ")}"]`,
      valueType: "string",
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
}
