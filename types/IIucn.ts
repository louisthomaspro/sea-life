export interface IIucnResponse {
  name: string
  result: IIucnObject[]
}

export interface IIucnObject {
  taxonid: number
  scientific_name: string
  kingdom: string
  phylum: string
  class: string
  order: string
  family: string
  genus: string
  main_common_name: string
  authority: string
  published_year: number
  assessment_date: string
  category: string
  criteria: string
  population_trend: string
  marine_system: boolean
  freshwater_system: boolean
  terrestrial_system: boolean
  assessor: string
  reviewer: string
  aoo_km2: any
  eoo_km2: any
  elevation_upper: any
  elevation_lower: any
  depth_upper: any
  depth_lower: any
  errata_flag: any
  errata_reason: any
  amended_flag: any
  amended_reason: any
}
