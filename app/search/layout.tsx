import { Suspense } from "react"
import { ShowResultsButton } from "@/features/search/components/show-results-button"
import SearchProvider from "@/features/search/search-provider"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <SearchProvider>
        <div className="min-h-dvh">{children}</div>
        <ShowResultsButton />
      </SearchProvider>
    </Suspense>
  )
}
