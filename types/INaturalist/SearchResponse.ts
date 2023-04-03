/**
 * Search object returned by INaturalist API
 * May not have all the fields available in the API
 * 
 * Interface generated with https://transform.tools/json-to-typescript
 * Response sample: https://api.inaturalist.org/v1/search?q=tetrarca tetragona&locale=fr
 */

import { ITaxa } from "./TaxaResponse"

export interface ISearchResponse {
  total_results: number
  page: number
  per_page: number
  results: ITaxaScored[]
}

export interface ITaxaScored {
  score: number
  type: string
  matches: string[]
  record: ITaxa
}