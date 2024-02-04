export interface INaturalistTaxa {
  id: number
  rank: string
  rank_level: number
  iconic_taxon_id: number
  ancestor_ids: number[]
  is_active: boolean
  name: string
  parent_id: number
  ancestry: string
  names: Name[]
  extinct: boolean
  default_photo: DefaultPhoto
  taxon_changes_count: number
  taxon_schemes_count: number
  observations_count: number
  photos_locked: boolean
  flag_counts: FlagCounts
  current_synonymous_taxon_ids: null
  taxon_photos: TaxonPhoto[]
  atlas_id: null
  complete_species_count: null
  wikipedia_url: string
  iconic_taxon_name: IconicTaxonName
  preferred_common_name: string
  ancestors: Ancestor[]
  conservation_statuses: ConservationStatus[]
  conservation_status: null
  listed_taxa_count: number
  listed_taxa: ListedTaxa[]
  wikipedia_summary: string
  vision: boolean
}

export interface Ancestor {
  id: number
  rank: string
  rank_level: number
  iconic_taxon_id: number
  ancestor_ids: number[]
  is_active: boolean
  name: string
  parent_id: number
  ancestry: string
  extinct: boolean
  default_photo?: DefaultPhoto
  taxon_changes_count: number
  taxon_schemes_count: number
  observations_count: number
  flag_counts: FlagCounts
  current_synonymous_taxon_ids: null
  atlas_id: null
  complete_species_count: number | null
  wikipedia_url: null | string
  complete_rank?: string
  iconic_taxon_name: IconicTaxonName
  preferred_common_name?: string
}

export interface DefaultPhoto {
  id: number
  license_code: null | string
  attribution: string
  url: string
  original_dimensions: OriginalDimensions
  flags: any[]
  square_url: string
  medium_url: string
}

export interface OriginalDimensions {
  height: number
  width: number
}

export interface FlagCounts {
  resolved: number
  unresolved: number
}

export enum IconicTaxonName {
  Actinopterygii = "Actinopterygii",
  Animalia = "Animalia",
}

export interface ConservationStatus {
  taxon_id: number
  taxon_name: string
  taxon_rank: string
  status: string
  authority: string
  iucn: number
  url: string
  description: null
  source_id: number
  geoprivacy: null
  updater_id: null
  created_at: Date
  updated_at: Date
  place: null
}

export interface ListedTaxa {
  id: number
  taxon_id: number
  establishment_means: string
  place: Place
  list: List
}

export interface List {
  id: number
  title: string
}

export interface Place {
  id: number
  name: string
  display_name: string
  admin_level: number | null
  ancestor_place_ids: number[]
}

export interface Name {
  name: string
  locale: string
  lexicon: string
  position: number
  is_valid: boolean
}

export interface TaxonPhoto {
  taxon_id: number
  photo: Photo
  taxon: Ancestor
}

export interface Photo {
  id: number
  license_code: null | string
  attribution: string
  url: string
  original_dimensions: OriginalDimensions
  flags: any[]
  native_page_url: null | string
  native_photo_id: null | string
  type: Type
  square_url: string
  small_url: string
  medium_url: string
  large_url: string
  original_url: string
}

export enum Type {
  LocalPhoto = "LocalPhoto",
}
