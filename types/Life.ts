// [x: string | number | symbol]: unknown;
export interface ILife {
  id: string;
  type: string; // "group" (Fauna, Flora, Vertebrata, Mollusca...),  "species" (Coris julis...)

  scientific_name: string;
  french_common_name: string;
  english_common_name: string;
  french_other_names: string;
  english_other_names: string;
  group_short_description: string;
  group_long_description: string;

  photos: ILifePhoto[];
  wikipedia_url?: string;
  taxonomy?: ITaxaRank[];

  conservation_status?: string; // IUCN Red List authority
  body_shape?: string; // "fusiform/normal", "elongated", "eel-like", "flat", "short and/or deep", "compressiform"
  habitat?: string; // "bathydemersal", "bathypelagic", "benthopelagic", "demersal", "pelagic-neritic", "pelagic-oceanic", "reef-associated"
  longevity?: string; // in years
  common_depth_min?: number;
  common_depth_max?: number;
  common_length?: number;
  common_length_type?: string; // "TL", "SL", "WD"...
  max_length?: number;
  max_length_type?: string; // "TL", "SL", "WD"...
  diameter?: number;
  dangerous?: string; // "harmless"...
  // diet: string // or tropic_level: number

  child_ids: string[]; // Populated by the cloud function on life creation
  parent_ids: string[]; // Populated by the client on life creation
  parent_id: string; // // Populated by the client on life creation
}

export interface ILifePhoto {
  id: string; // uuid generated on life creation
  storage_path: string; // path to the photo in the storage (empty if not uploaded)
  original_url: string; // ex: https://static.inaturalist.org/photos/1234567/original.jpg
  attribution: string;
}

export interface ITaxaRank {
  id: string;
  rank: string; // "kingdom", "phylum", "class", "order", "family", "genus", "species"
  scientific_name: string;
  french_common_name: string;
  english_common_name: string;
}



/*

"WD" = weight
-- "SL" = standard length (total length of the fish excluding the tail)
-- "TL" = total length (total length of the fish including the tail)
X "BL" = body length (length of the fish excluding the head and the tail)
X "FL" = fork length (length of the fish from the tip of the snout to the fork of the tail)
X "ML" = mean length (average length of the fish excluding the head and the tail)
X "CL" = compressed length (length of the fish excluding the head and the tail, measured after the fish has been compressed in a straight line)
X "SHL" = snout to head length (length of the fish from the tip of the snout to the tip of the head)
X "NG" = not given
X "DL" = dorsal length (length of the fish from the tip of the snout to the tip of the dorsal fin)
X "H" = height (height of the fish)
X "BASL" = body and standard length (total length of the fish excluding the tail)
X "OT" = other
X "COLD" = cold
X "CW" = cold weight

*/