/**
 * Taxa object returned by INaturalist API
 * May not have all the fields available in the API
 * 
 * Interface generated with https://transform.tools/json-to-typescript
 * Response sample: https://api.inaturalist.org/v1/taxa/118945?locale=fr
 */

export interface ITaxaResponse {
  total_results: number;
  page: number;
  per_page: number;
  results: ITaxa[];
}

export interface ITaxa {
  photos_locked: boolean;
  taxon_schemes_count: number;
  ancestry: string;
  wikipedia_url: string;
  current_synonymous_taxon_ids: any;
  iconic_taxon_id: number;
  taxon_changes_count: number;
  complete_species_count: any;
  rank: string;
  extinct: boolean;
  id: number;
  ancestor_ids: number[];
  observations_count: number;
  is_active: boolean;
  flag_counts: {
    resolved: number;
    unresolved: number;
  };
  taxon_photos: ITaxonPhoto[];
  rank_level: number;
  atlas_id: number;
  parent_id: number;
  name: string;
  default_photo: IPhoto;
  iconic_taxon_name: string;
  preferred_common_name: string;
  english_common_name: string;
  conservation_status: IConservationStatus;
  ancestors: ITaxa[];
  conservation_statuses: IConservationStatus[];
  listed_taxa_count: number;
  listed_taxa: IListedTaxa[];
  wikipedia_summary: string;
  vision: boolean;
}

export interface IFlagCounts {
  resolved: number;
  unresolved: number;
}

export interface ITaxonPhoto {
  taxon_id: number;
  photo: IPhoto;
  taxon: ITaxa;
}

export interface IPhoto {
  id: number;
  license_code?: string;
  attribution: string;
  url: string;
  original_dimensions: {
    height: number;
    width: number;
  };
  flags: any[];
  native_page_url: string;
  native_photo_id: string;
  type: string;
  square_url: string;
  small_url: string;
  medium_url: string;
  large_url: string;
  original_url: string;
}

export interface IConservationStatus {
  user_id: number;
  status_name: string;
  iucn: number;
  authority: string;
  geoprivacy: any;
  source_id: any;
  place_id: any;
  status: string;
}

export interface IUser {
  id: number;
  login: string;
  icon_url: any;
  orcid: any;
}

export interface IListedTaxa {
  id: number
  taxon_id: number
  establishment_means: string
  place: IPlace
  list: IList
}

export interface IPlace {
  id: number
  name: string
  display_name: string
  admin_level: number
  ancestor_place_ids: number[]
}

export interface IList {
  id: number
  title: string
}
