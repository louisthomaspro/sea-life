import { CreateListTrigger } from "@/features/list/components/create-update-list-trigger"
import ListsListing from "@/features/list/components/lists-listing"

export default function ListsPage() {
  // https://github.com/TanStack/query/issues/6591
  // const queryClient = getQueryClient()

  // void queryClient.prefetchQuery({
  //   queryKey: ["lists"],
  //   queryFn: async () => getListsAction(),
  // })

  return (
    <div className="container pt-10">
      <CreateListTrigger />
      {/* <HydrationBoundary> */}
      <ListsListing />
      {/* </HydrationBoundary> */}
    </div>
  )
}
