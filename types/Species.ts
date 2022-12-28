// [x: string | number | symbol]: unknown;
export interface ISpecies {
  id: string;
  // display: boolean;

  scientific_name: string;
  common_name: {
    fr: string[];
    en: string[];
  };
  photos: ISpeciesPhoto[];
  wikipedia_url?: string;
  taxonomy?: ITaxonomy[]; // from inaturalist
  taxonomy_ids?: string[]; // only scientific names

  rarity?: string; // "rare", "uncommon", "common", "abundant"
  depth_min?: number;
  depth_max?: number;
  sizes?: ISpeciesSizes;

  regions?: string[]; // "mediterranean"
  biotopes?: string[]; // "open_sea", "reef" https://www.observatoire-marin.com/med_biotopes.htm
  conservation_status?: string; // IUCN Red List authority (https://www.iucnredlist.org/) "DD", "LC", "NT", "VU", "EN", "CR", "EW", "EX", "NE"

  // body_shape?: string;
  // longevity?: string;
  // diameter?: number;
  // dangerous?: string; // "harmless"...
  // diet: string // or tropic_level: number
}

export interface ISpeciesSizes {
  length_max?: number;
  length_average?: number;
  alga_length?: number;
  leaf_diameter?: number;
  alga_height?: number;
  plume_diameter?: number;
  colony_size?: number;
  polyp_diameter?: number;
  diameter?: number;
}

export interface ISpeciesPhoto {
  id: string;
  storage_path: string;
  original_url: string; // ex: https://static.inaturalist.org/photos/1234567/original.jpg
  attribution: string;
}

export interface ITaxonomy {
  id: number;
  rank: string; // "kingdom", "phylum", "class", "order", "family", "genus", "species"
  scientific_name: string;
  common_name: {
    [lang: string]: string;
  };
}
