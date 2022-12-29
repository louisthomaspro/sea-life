export const storageKey = "userRegion";

export const regionsDict: {
  [region: string]: {
    title: {
      [lang: string]: string;
    };
  };
} = {
  all: {
    title: {
      fr: "Toutes les régions",
      en: "All regions",
    },
  },
  "red-sea": {
    title: {
      fr: "Mer Rouge",
      en: "Red Sea",
    },
  },
  "mediterranean-sea": {
    title: {
      fr: "Méditerranée",
      en: "Mediterranean Sea",
    },
  },
  "indian-ocean": {
    title: {
      fr: "Océan Indien",
      en: "Indian Ocean",
    },
  },
  "tropical-atlantic": {
    title: {
      fr: "Atlantique tropical",
      en: "Tropical Atlantic",
    },
  },
  "temperate-atlantic": {
    title: {
      fr: "Atlantique tempéré",
      en: "Temperate Atlantic",
    },
  },
  "tropical-pacific": {
    title: {
      fr: "Pacifique tropical",
      en: "Tropical Pacific",
    },
  },
};

export const regionsList: any[] = [];
for (const region of Object.keys(regionsDict)) {
  regionsList.push(
    {
      code: region,
      name: regionsDict[region].title.fr,
    }
  );
}
