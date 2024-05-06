import Link from "next/link"
import { redirect } from "next/navigation"
import { CreateListTrigger } from "@/features/list/components/create-update-list-trigger"

import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ImageLoader from "@/components/ui/image-loader"

export const dynamic = "force-dynamic"

export default async function ListsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/account")
  }

  const lists = await prisma.list.findMany({
    where: {
      ownerId: user.id,
    },
    include: {
      _count: {
        select: {
          species: true,
        },
      },
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
        take: 4,
      },
    },
  })

  return (
    <div className="container pt-10">
      <CreateListTrigger />

      <div className="mb-10 mt-4 grid grid-cols-2 gap-4" suppressHydrationWarning>
        {lists.map((list, i) => (
          <Link key={i} href={`/lists/${list.id}`}>
            <Card>
              <CardContent className="relative p-0">
                <div className="relative">
                  <div className="grid grid-cols-2 gap-0.5">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="relative aspect-[3/2] overflow-hidden rounded-sm">
                        {list.species[index] ? (
                          <ImageLoader
                            src={list.species[index].taxa.medias[0]?.url}
                            alt={list.species[index].taxa.commonNames.en?.[0]!}
                            fill
                            sizes="25vw"
                            className="object-cover"
                          />
                        ) : (
                          <ImageLoader
                            src="/placeholder.jpg"
                            sizes="25vw"
                            alt="placeholder"
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <Badge className="absolute -bottom-2 -right-2">{list._count.species}</Badge>
                </div>
                <div className="grid p-2">
                  <div className="overflow-auto">
                    <div className="truncate font-semibold">{list.name}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
