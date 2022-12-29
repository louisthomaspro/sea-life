export const storageKey = "userRegion";

export const regionsList = [
  { name: "Toutes les régions", code: "all" },
  { name: "Mer Méditerranée", code: "mediterranean-sea" },
];

export const regionsDict: {
  [region: string]: {
    title: {
      [lang: string]: string;
    };
  };
} = {
  'red-sea': {
    title: {
      fr: "Mer Rouge",
      en: "Red Sea",
    },
  },
  'mediterranean-sea': {
    title: {
      fr: "Méditerranée",
      en: "Mediterranean Sea",
    },
  },
  'indian-ocean': {
    title: {
      fr: "Océan Indien",
      en: "Indian Ocean",
    },
  },
  'tropical-atlantic': {
    title: {
      fr: "Atlantique tropical",
      en: "Tropical Atlantic",
    },
  },
  'temperate-atlantic': {
    title: {
      fr: "Atlantique tempéré",
      en: "Temperate Atlantic",
    },
  },
  'tropical-pacific': {
    title: {
      fr: "Pacifique tropical",
      en: "Tropical Pacific",
    },
  },
};
