import { searchSpecies } from "@/features/search/search-server-utils"

export type SearchResult = {
  id: string
  scientificName: string
  commonNames: {
    [key: string]: string[]
  }
  url: string
  caudal_fin_shape: string
  body_shape: string
  colors: string[]
  regions: string[]
  patterns: string[]
}

export interface RequestBody {
  colors?: string[]
  pattern?: string
  region?: string
  caudal_fin_shape?: string
  body_shape?: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as RequestBody

  const searchResults = await searchSpecies(body)

  return Response.json(searchResults)
}
