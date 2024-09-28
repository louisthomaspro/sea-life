import { CreateListTrigger } from "@/features/list/components/create-update-list-trigger"
import ListsListing from "@/features/list/components/lists-listing"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"

import { getQueryClient } from "@/lib/react-query/get-query-client"
import { getListsAction } from "@/lib/services/lists-actions"

export default function ListsPage() {
  const queryClient = getQueryClient()

  queryClient.prefetchQuery({
    queryKey: ["lists"],
    queryFn: async () => getListsAction(),
  })

  return (
    <div className="container pt-10">
      <CreateListTrigger />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ListsListing />
      </HydrationBoundary>
    </div>
  )
}
