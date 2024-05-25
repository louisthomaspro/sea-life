import VirtualList from "@/features/search/components/virtual-list"
import { searchSpecies } from "@/features/search/search-server-utils"
import { parseUrl } from "@/features/search/search-utils"

export default async function ResultsPage({ searchParams }: { searchParams?: any }) {
  const customSearchParams = new URLSearchParams(searchParams)
  const results = await searchSpecies(parseUrl(customSearchParams))

  return (
    <div>
      <VirtualList results={results} />
    </div>
  )
}
