export const rarityList: {
  id: string;
  name: {
    [lang: string]: string;
  };
}[] = [
  {
    id: "rare",
    name: {
      fr: "Rare",
      en: "Rare",
    },
  },
  {
    id: "uncommon",
    name: {
      fr: "Peu commun",
      en: "Uncommon",
    },
  },
  {
    id: "common",
    name: {
      fr: "Commun",
      en: "Common",
    },
  },
  {
    id: "abundant",
    name: {
      fr: "Abondant",
      en: "Abundant",
    },
  },
];

export const rarityDict: {
  [rarity: string]: {
    name: {
      [lang: string]: string;
    };
  };
} = {};
for (const rarity of rarityList) {
  rarityDict[rarity.id] = rarity;
}