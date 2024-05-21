import AiSearchForm from "@/features/search/components/ai-search-form"
import FishesSearchForm from "@/features/search/components/fishes-search-form"
import { SearchResultsButton } from "@/features/search/components/search-results-drawer-content"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SearchPage() {
  return (
    <div className="container relative pb-20 pt-10">
      {/* Header */}
      <h1 className="px-5 py-4 text-3xl font-bold tracking-tighter">Search</h1>
      <FishesSearchForm />
      {/* <Tabs defaultValue="fishes">
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="fishes">
            Fishes
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="ai">
            AI
          </TabsTrigger>
        </TabsList>
        <TabsContent value="fishes">
          <FishesSearchForm />
        </TabsContent>
        <TabsContent value="ai">
          <AiSearchForm />
        </TabsContent>
      </Tabs> */}
    </div>
  )
}
