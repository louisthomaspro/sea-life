"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { getListAction } from "@/lib/services/lists-actions"
import { Icons } from "@/components/ui/icons/icons"
import SpeciesCard from "@/components/species-card"

export default function SpeciesListing() {
  const params = useParams<{ listId: string }>()
  let {
    data: list,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`lists-${params.listId}`],
    queryFn: async () => getListAction(Number(params.listId)),
  })

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Icons.spinner className="h-5 w-5" />
      </div>
    )
  }

  if (!list) return null

  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      {list?.species.map((species, i) => <SpeciesCard key={i} species={species.taxa} />)}
    </div>
  )
}
