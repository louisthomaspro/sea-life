import { Suspense } from "react"

import prisma from "@/lib/prisma"
import { Skeleton } from "@/components/ui/skeleton"

const ListCount = async ({ ownerId }: { ownerId: string }) => {
  const listCount = await prisma.list.count({
    where: {
      ownerId,
    },
  })

  return listCount
}

export const ListCountSuspense = ({ ownerId }: { ownerId: string }) => {
  return (
    <Suspense fallback={<Skeleton className="h-5 w-3" />}>
      <ListCount ownerId={ownerId} />
    </Suspense>
  )
}
