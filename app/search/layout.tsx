import { ShowResultsButton } from "@/features/search/components/show-results-button"
import SearchProvider from "@/features/search/search-provider"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <div className="min-h-dvh">{children}</div>
      <ShowResultsButton />
    </SearchProvider>
  )
}
