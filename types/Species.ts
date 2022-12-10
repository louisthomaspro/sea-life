// [x: string | number | symbol]: unknown;
export interface ILife {
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

  rarity?: string; // "rare", "uncommon", "common", "abundant"
  // habitat?: string[]; //
  // geographic_distributions?: string[];
  // conservation_status?: string; // IUCN Red List authority
  // body_shape?: string;
  // longevity?: string;
  // common_depth_min?: number;
  // common_depth_max?: number;
  // common_length?: number;
  // common_length_type?: string; // "TL", "SL", "WD"...
  // max_length?: number;
  // max_length_type?: string; // "TL", "SL", "WD"...
  // diameter?: number;
  // dangerous?: string; // "harmless"...
  // diet: string // or tropic_level: number
}

export interface ISpeciesPhoto {
  id: string; // uuid generated on life creation
  original_url: string; // ex: https://static.inaturalist.org/photos/1234567/original.jpg
  attribution: string;
}

export interface ITaxonomy {
  id: string;
  rank: string; // "kingdom", "phylum", "class", "order", "family", "genus", "species"
  scientific_name: string;
  common_name: {
    fr: string;
    en: string;
  };
}