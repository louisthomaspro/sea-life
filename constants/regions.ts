export const storageKey = "userRegion";

export const regionsList: {
  id: string;
  name: {
    [lang: string]: string;
  };
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
      en: "The Tropical Pacific",
      fr: "Le Pacifique tropical",
    },
  },
  {
    id: "indian-ocean",
    name: {
      en: "The Indian Ocean",
      fr: "L'Océan Indien",
    },
  },
  {
    id: "mediterranean-sea",
    name: {
      en: "The Mediterranean Sea",
      fr: "La Mer Méditerranée",
    },
  },
];

export const regionsDict: {
  [region: string]: {
    name: {
      [lang: string]: string;
    };
  };
} = {};
for (const region of regionsList) {
  regionsDict[region.id] = region;
}
