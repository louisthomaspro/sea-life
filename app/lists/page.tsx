import { CreateListTrigger } from "@/features/list/components/create-update-list-trigger"
import ListsListing from "@/features/list/components/lists-listing"

export default function ListsPage() {
  return (
    <div className="container pt-10">
      <CreateListTrigger />

      <ListsListing />
    </div>
  )
}
