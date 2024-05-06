import Link from "next/link"
import { notFound } from "next/navigation"
import { EditListTrigger } from "@/features/list/components/create-update-list-trigger"
import DeleteListTrigger from "@/features/list/components/delete-list-trigger"

import prisma from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import SpeciesCard from "@/components/species-card"

export const dynamic = "force-static"

export default async function ListDetailsPage({ params }: { params: { listId: string } }) {
  const list = await prisma.list.findUnique({
    where: {
      id: Number(params.listId),
    },
    include: {
      species: {
        include: {
          taxa: {
            include: {
              medias: {
                take: 1,
              },
            },
          },
        },
      },
    },
  })

  if (!list) {
    return notFound()
  }

  return (
    <div className="container py-6">
      {/* Header */}
      <div className={cn("mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2")}>
        <Link href={"/lists"}>
          <Button variant="outline" size="icon">
            <Icons.chevronLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-center text-3xl font-bold tracking-tighter">{list.name}</h1>
      </div>

      <div className="flex gap-2">
        <DeleteListTrigger />
        <EditListTrigger list={list} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {list?.species.map((species, i) => <SpeciesCard key={i} species={species.taxa} />)}
      </div>
    </div>
  )
}
