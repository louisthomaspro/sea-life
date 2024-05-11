export const habitatsList: {
  id: string
  type: number
  title: {
    [lang: string]: string
  }
  description: {
    [lang: string]: string
  }
}[] = [
  {
    id: "open_sea",
    type: 1,
    title: {
      fr: "Pleine mer",
      en: "Open sea",
    },
    description: {
      fr: "Désigne l'immensité de l'eau de la mer éloignée de la côte, caractérisée par des courants forts et des niveaux de lumière faibles.",
      en: "The vast expanse of ocean water away from the coast, characterized by strong currents and low light levels.",
    },
  },
  {
    id: "reef",
    type: 1,
    title: {
      fr: "Récifs",
      en: "Reefs",
    },
    description: {
      fr: "Les récifs sont des formations rocheuses ou coralliennes qui se trouvent généralement près de la surface de l'eau.",
      en: "Reefs are rocky or coral formations that typically occur near the surface of the water.",
    },
  },
  {
    id: "sandy_muddy_seafloor",
    type: 1,
    title: {
      fr: "Zone sablo-vaseuse",
      en: "Sandy-silty areas",
    },
    description: {
      fr: "Les fonds marins sablonneux et vaseux se caractérisent par la présence de sable et de vase.",
      en: "Sandy-silty areas is characterized by the presence of sand and mud.",
    },
  },
  {
    id: "coastal_zone",
    type: 1,
    title: {
      fr: "Zone côtière",
      en: "Coastal zone",
    },
    description: {
      fr: "La zone côtière se caractérise par sa proximité avec la terre ferme et les eaux peu profondes.",
      en: "The coastal zone is characterized by its proximity to land and shallow waters.",
    },
  },
  {
    id: "seagrass_algae",
    type: 1,
    title: {
      fr: "Herbiers",
      en: "Seagrass and Algae",
    },
    description: {
      fr: "Les herbiers marins et les algues se trouvent généralement dans les eaux peu profondes près de la côte.",
      en: "Seagrass and algae are typically found in shallow waters near the coast.",
    },
  },
  {
    id: "sandy_seafloor",
    type: 1,
    title: {
      fr: "Zone sablonneuse",
      en: "Sandy areas",
    },
    description: {
      fr: "Le fond marin sablonneux se caractérise par la présence de sable.",
      en: "Sandy areas is characterized by the presence of sand.",
    },
  },
  {
    id: "mangrove",
    type: 1,
    title: {
      fr: "Mangrove",
      en: "Mangrove",
    },
    description: {
      fr: "Les mangroves sont des forêts côtières humides peuplées d'arbres et de plantes qui se trouvent dans les zones intertidales.",
      en: "Mangroves are humid coastal forests populated by trees and plants found in intertidal zones.",
    },
  },
  {
    id: "seafloor",
    type: 1,
    title: {
      fr: "Fond marin",
      en: "Seafloor",
    },
    description: {
      fr: "Le fond marin est la surface du fond de l'océan où vivent les organismes marins.",
      en: "The seafloor is the surface of the ocean bottom where marine organisms live.",
    },
  },
  {
    id: "stagnant_water",
    type: 1,
    title: {
      fr: "Eau stagnante",
      en: "Stagnant water",
    },
    description: {
      fr: "L'eau stagnante est caractérisée par une faible circulation et une faible oxygénation.",
      en: "Stagnant water is characterized by low circulation and low oxygenation.",
    },
  },
  {
    id: "terrestrial",
    type: 1,
    title: {
      fr: "Terrestre",
      en: "Terrestrial",
    },
    description: {
      fr: "Les habitats terrestres se réfèrent aux zones situées sur la terre ferme, à l'intérieur des limites des zones côtières.",
      en: "Terrestrial habitats refer to areas on land, within the boundaries of coastal zones.",
    },
  },
  {
    id: "beach",
    type: 1,
    title: {
      fr: "Plage",
      en: "Beach",
    },
    description: {
      fr: "Les plages sont des zones côtières sablonneuses ou rocheuses où les vagues viennent se briser.",
      en: "Beaches are sandy or rocky coastal areas where waves break.",
    },
  },
  {
    id: "cavity_crevices",
    type: 2,
    title: {
      fr: "Cavités/fissures",
      en: "Cavities/crevices",
    },
    description: {
      fr: "Les cavités et les fissures sont des espaces creux ou étroits dans les rochers, les récifs et les fonds marins.",
      en: "Cavities and crevices are hollow or narrow spaces in rocks, reefs, and seafloors.",
    },
  },
  {
    id: "overhanging",
    type: 2,
    title: {
      fr: "En surplomb",
      en: "Overhanging",
    },
    description: {
      fr: "(FAUX) Les habitats en surplomb se réfèrent aux zones situées au-dessus de l'eau, comme les falaises ou les surplombs rocheux.",
      en: "(FAUX) Overhanging habitats refer to areas above water, such as cliffs or rocky overhangs.",
    },
  },
  {
    id: "sheltered_zone",
    type: 2,
    title: {
      fr: "Zone abritées",
      en: "Sheltered areas",
    },
    description: {
      fr: "Les zones abritées se réfèrent aux endroits protégés des courants et des vagues, comme les baies et les criques.",
      en: "Sheltered areas refer to places protected from currents and waves, such as bays and coves.",
    },
  },
  {
    id: "corals",
    type: 2,
    title: {
      fr: "Coraux",
      en: "Corals",
    },
    description: {
      fr: "Les coraux sont des organismes vivants qui se développent en colonies et forment des récifs coralliens.",
      en: "Corals are living organisms that grow in colonies and form coral reefs.",
    },
  },
  {
    id: "current",
    type: 2,
    title: {
      fr: "Courant",
      en: "Current",
    },
    description: {
      fr: "Les habitats de courant se réfèrent aux zones où les courants d'eau sont forts et constants.",
      en: "Current habitats refer to areas where water currents are strong and consistent.",
    },
  },
]

export const habitatsDict: {
  [habitat: string]: {
    type: number
    title: {
      [lang: string]: string
    }
    description: {
      [lang: string]: string
    }
  }
} = {}
for (const habitat of habitatsList) {
  habitatsDict[habitat.id] = habitat
}
