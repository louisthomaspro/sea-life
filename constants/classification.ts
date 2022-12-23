import { IClassItem } from "../types/Classification";

export const classification: IClassItem[] = [
  {
    title: {
      fr: "Faune",
    },
    permalink: "fauna",
    id: "animalia",
    children: [
      {
        title: {
          fr: "Mollusques",
        },
        permalink: "molluscs",
        id: "mollusca",
        children: [
          {
            title: {
              fr: "Gastéropodes",
            },
            permalink: "gastropoda",
            id: "gastropoda",
            children: [],
            showSpecies: true,
          },
          {
            title: {
              fr: "Polyplacophores",
            },
            subtitle: {
              fr: "Chiton",
            },
            permalink: "polyplacophora",
            id: "polyplacophora",
            children: [],
          },
          {
            title: {
              fr: "Céphalopodes",
            },
            permalink: "cephalopoda",
            id: "cephalopoda",
            children: [],
          },
          {
            title: {
              fr: "Bivalves",
            },
            permalink: "bivalvia",
            id: "bivalvia",
            children: [],
          },
        ],
      },
      {
        title: {
          fr: "Arthropodes",
        },
        permalink: "arthropoda",
        id: "arthropoda",
        children: [],
      },
      {
        title: {
          fr: "Actinoptérygiens ",
        },
        permalink: "actinopterygii",
        id: "actinopterygii",
        children: [],
      },
      {
        title: {
          fr: "Annélides",
        },
        permalink: "annelida",
        id: "annelida",
        children: [],
      },
      {
        title: {
          fr: "Cnidaires",
        },
        permalink: "cnidaria",
        id: "cnidaria",
        children: [],
      },
      {
        title: {
          fr: "Échinodermes",
        },
        permalink: "echinodermata",
        id: "echinodermata",
        children: [],
      },
      {
        title: {
          fr: "Éponges",
        },
        permalink: "porifera",
        id: "porifera",
        children: [],
      },
      {
        title: {
          fr: "Cténophores",
        },
        permalink: "ctenophora",
        id: "ctenophora",
        children: [],
      },
      {
        title: {
          fr: "Plathelminthes",
        },
        permalink: "platyhelminthes",
        id: "platyhelminthes",
        children: [],
      },
      {
        title: {
          fr: "Bryozoaires",
        },
        permalink: "bryozoa",
        id: "bryozoa",
        children: [],
      },
    ],
  },
  {
    title: {
      fr: "Flore",
    },
    permalink: "flora",
    id: "plantae",
    children: [
      {
        title: {
          fr: "Plantes à Fleurs",
        },
        permalink: "angiospermae",
        id: "angiospermae",
        children: [],
      },
      {
        title: {
          fr: "Algues Brunes",
        },
        permalink: "phaeophyceae",
        id: "phaeophyceae",
        children: [],
      },
      {
        title: {
          fr: "Algues Vertes",
        },
        permalink: "chlorophyta",
        id: "chlorophyta",
        children: [],
      },
      {
        title: {
          fr: "Algues Rouges",
        },
        permalink: "rhodophyta",
        id: "rhodophyta",
        children: [],
      },
    ],
  },
];
