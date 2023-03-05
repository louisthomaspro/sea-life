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
