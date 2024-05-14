"use client"

import { pushModal } from "@/lib/pushmodal/pushmodal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DrawerContent } from "@/components/ui/drawer"

export const SearchResultsButton = () => {
  return (
    <Button
      className="fixed bottom-20 right-2 gap-2"
      variant={"outline"}
      onClick={() => pushModal("SearchResultsDrawer")}
    >
      <span>Show results</span>
      <Badge>0</Badge>
    </Button>
  )
}

export default function SearchResultsDrawerContent() {
  return (
    <DrawerContent>
      <h1>Search Results Drawer Content</h1>
    </DrawerContent>
  )
}
