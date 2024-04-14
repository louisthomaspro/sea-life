import Link from "next/link"
import { notFound } from "next/navigation"
import { groups } from "@/constants/groups"

import { getSpeciesByAncestorList } from "@/lib/database/utils"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import ImageLoader from "@/components/ui/image-loader"

export default async function GroupPage({ params }: { params: { groupId: string } }) {
  // get the group details from groups tree variable
  const group = groups.find((group) => group.id === params.groupId)
  const children = groups.filter((group) => group.parentId === params.groupId)
  if (!group) notFound()

  let species: Awaited<ReturnType<typeof getSpeciesByAncestorList>> = []
  if (group?.showSpecies) {
    species = await getSpeciesByAncestorList(group.includesTaxa)
  }

  return (
    <div className="container py-6">
      {/* Header */}
      <div className={cn("mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2")}>
        <Link href={group.parentId ? `/explore/${group.parentId}` : "/"}>
          <Button variant="outline" size="icon">
            <Icons.chevronLeft className="size-4" />
          </Button>
        </Link>
        <h1 className="text-center text-3xl font-bold tracking-tighter">{group.title.en}</h1>
      </div>

      {/* List of groups */}
      {children && !group.showSpecies && (
        <div className="grid grid-cols-2 gap-2">
          {children.map((child: any) => (
            <Link key={child.id} href={`/explore/${child.id}`}>
              <Card>
                <CardContent className="relative p-0">
                  <div className="relative aspect-[3/2] w-full">
                    <ImageLoader src={child.photos[0]} alt={child.title.fr} fill className="rounded-xl object-cover" />
                  </div>
                  <div className="grid p-2">
                    <div className="overflow-auto">
                      <div className="truncate font-semibold">{child.title.en}</div>
                      <div className="truncate font-semibold">{child.title.fr}</div>
                    </div>
                    <div className="truncate text-sm italic text-gray-500">Tursiops truncatus</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* List of species */}
      {group.showSpecies && (
        <div className="grid grid-cols-2 gap-2">
          {species.map((species) => (
            <Link key={species.id} href={`/species/${species.id}`}>
              <Card>
                <CardContent className="relative p-0">
                  <div className="relative aspect-[3/2] w-full">
                    {species.medias?.length > 0 && (
                      <ImageLoader
                        src={species.medias[0].url}
                        alt={species.scientificName ?? ""}
                        fill
                        className="rounded-xl object-cover"
                      />
                    )}
                  </div>
                  <div className="grid p-2">
                    <div className="overflow-auto">
                      <div className="truncate font-semibold">{species.commonNames.en}</div>
                      <div className="truncate font-semibold">{species.commonNames.fr}</div>
                    </div>
                    <div className="truncate text-sm italic text-gray-500">Tursiops truncatus</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
