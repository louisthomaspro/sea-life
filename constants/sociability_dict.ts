export const sociabilityList: {
  id: string
  name: {
    [lang: string]: string
  }
}[] = [
  {
    id: "solitary",
    name: {
      fr: "Vivant en solitaire",
      en: "Solitary",
    },
  },
  {
    id: "couple",
    name: {
      fr: "Vivant en couple",
      en: "Living in a couple",
    },
  },
  {
    id: "group",
    name: {
      fr: "Vivant en groupe",
      en: "Living in a group",
    },
  },
  {
    id: "shoal",
    name: {
      fr: "Vivant en banc",
      en: "Living in a shoal",
    },
  },
]

export const sociabilityDict: {
  [sociability: string]: {
    name: {
      [lang: string]: string
    }
  }
} = {}
for (const sociability of sociabilityList) {
  sociabilityDict[sociability.id] = sociability
}
