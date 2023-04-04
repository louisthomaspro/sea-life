import { Timestamp } from "firebase/firestore/lite";

// [x: string | number | symbol]: unknown;
export interface ISpecies {
  id: string;
  is_deleted: boolean;
  timestamp?: Timestamp;

  external_ids?: {
    inaturalist?: string;
    iucn?: string;
    fishbase?: string;
  };

  scientific_name?: string;
  common_names?: {
    fr?: string[];
    en?: string[];
  };
  photos?: ISpeciesPhoto[];
  wikipedia_url?: string;
  taxonomy?: ITaxonomy[]; // from inaturalist
  taxonomy_ids?: string[]; // only scientific names

  rarity?: string; // "rare", "uncommon", "common", "abundant"
  depth_min?: number;
  depth_max?: number;
  sizes?: ISpeciesSizes;

  conservation_status?: string; // IUCN Red List authority (https://www.iucnredlist.org/) "DD", "LC", "NT", "VU", "EN", "CR", "EW", "EX", "NE"
  regions?: string[]; // "mediterranean"
  habitats_1?: string[]; // "open_sea", "reef", "seagrass_algae"...
  habitats_2?: string[]; // "cavity_crevices", "corals", "hidden", "surface"...
  sociability?: string; // "solitary", "couple", "group", "shoal"
  behavior?: string; // "aggressive"
  diet?: string; // "carnivore", "herbivore", "omnivore"
  feeding_type?: string[]; // "filter_feeder", "parasite", 
  

  // body_shape?: string;
  // longevity?: string;
  // diameter?: number;
  // dangerous?: string; // "harmless"...
}

export interface ISpeciesSizes {
  // fishes
  // icon: ruler_h
  common_length?: number;
  max_length?: number;

  // sea urchins (without spines), starfishes
  // icon: diameter
  common_diameter?: number;
  max_diameter?: number;

  common_colony_size?: number;
  max_colony_size?: number;
  common_polyp_diameter?: number;
  max_polyp_diameter?: number;
  common_plume_diameter?: number;

  // alga_length?: number;
  // leaf_diameter?: number;
  // alga_height?: number;
}

export interface ISpeciesPhoto {
  // id: string;
  // storage_path: string;
  original_url: string; // ex: https://static.inaturalist.org/photos/1234567/original.jpg
  attribution: string;
  blurhash?: any;
}

export interface ITaxonomy {
  id?: number;
  rank: string; // "kingdom", "phylum", "class", "order", "family", "genus", "species"
  scientific_name: string;
  common_name: {
    [lang: string]: string;
  };
}
