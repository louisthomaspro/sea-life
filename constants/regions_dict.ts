export const storageKey = "userRegion"

export const regionsList: {
  id: string
  name: {
    [lang: string]: string
  }
}[] = [
  {
    id: "all",
    name: {
      fr: "Toutes les régions",
      en: "All regions",
    },
  },
  {
    id: "tropical-pacific",
    name: {
      en: "Tropical Pacific",
      fr: "Pacifique tropical",
    },
  },
  {
    id: "indian-ocean",
    name: {
      en: "Indian Ocean",
      fr: "Océan Indien",
    },
  },
  {
    id: "mediterranean-sea",
    name: {
      en: "Mediterranean Sea",
      fr: "Mer Méditerranée",
    },
  },
  {
    id: "temperate-atlantic",
    name: {
      en: "Temperate Atlantic",
      fr: "Atlantique tempéré",
    },
  },
  {
    id: "tropical-atlantic",
    name: {
      en: "Tropical Atlantic",
      fr: "Atlantique tropical",
    },
  },
]

export const regionsDict: {
  [region: string]: {
    name: {
      [lang: string]: string
    }
  }
} = {}
for (const region of regionsList) {
  regionsDict[region.id] = region
}
