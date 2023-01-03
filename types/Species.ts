// [x: string | number | symbol]: unknown;
export interface ISpecies {
  id: string;
  // display: boolean;

  external_ids?: {
    inaturalist?: string;
    iucn?: string;
  }

  scientific_name: string;
  common_names: {
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
  max_length?: number;
  common_length?: number;
  alga_length?: number;
  leaf_diameter?: number;
  alga_height?: number;
  common_diameter?: number;
  common_colony_size?: number;
  max_colony_size? : number;
  common_polyp_diameter?: number;
  max_polyp_diameter?: number;
  common_plume_diameter?: number;
}

export interface ISpeciesPhoto {
  id: string;
  storage_path: string;
  original_url: string; // ex: https://static.inaturalist.org/photos/1234567/original.jpg
  attribution: string;
  blurhash: any;
}

export interface ITaxonomy {
  id: number;
  rank: string; // "kingdom", "phylum", "class", "order", "family", "genus", "species"
  scientific_name: string;
  common_name: {
    [lang: string]: string;
  };
}
