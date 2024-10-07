import Link from "next/link"
import { notFound } from "next/navigation"
import { EditGroupTrigger } from "@/features/admin/components/create-update-group"
import { Prisma } from "@prisma/client"

import { getSpeciesByAncestorList } from "@/lib/database/utils"
import prisma from "@/lib/prisma"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons/icons"
import HighLevelGroupCard from "@/components/high-level-group-card"
import LowLevelGroupCard from "@/components/low-level-group-card"
import SpeciesCard from "@/components/species-card"

export async function generateStaticParams() {
  const groups = await prisma.group.findMany({
    select: {
      slug: true,
    },
  })
  return groups.map((group) => ({
    groupSlug: group.slug,
  }))
}

export default async function GroupPage({ params }: { params: { groupSlug: string } }) {
  // get the group details from groups tree variable
  const group = await prisma.group.findUnique({
    include: {
      parent: {
        select: {
          slug: true,
        },
      },
      children: {
        include: {
          highlightedSpecies: {
            include: {
              medias: {
                select: {
                  url: true,
                  blurhashDataUrl: true,
                },
                orderBy: {
                  position: "asc",
                },
              },
            },
          },
          highLevelTaxa: {
            select: {
              id: true,
            },
          },
        },
      },
      highLevelTaxa: {
        select: {
          id: true,
        },
      },
    },
    where: {
      slug: params.groupSlug,
    },
  })
  if (!group) notFound()

  // sort group by common name en
  group.children.sort((a, b) => (a.commonNames.en ?? "").localeCompare(b.commonNames.en ?? ""))

  const showSpecies = group.children.length === 0

  let species: Prisma.TaxaGetPayload<{
    include: {
      medias: {
        select: {
          url: true
          blurhashDataUrl: true
        }
      }
    }
  }>[] = []

  // if the group has no children, get the species
  if (showSpecies) {
    species = await getSpeciesByAncestorList(group.highLevelTaxa.map((taxa) => taxa.id))
  }

  return (
    <div className="container max-w-screen-md py-6">
      {/* Header */}
      <div className={cn("mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2")}>
        <Link href={group.parent ? `/explore/${group.parent.slug}` : "/"}>
          <Button variant="outline" size="icon">
            <Icons.chevronLeft className="size-5" />
          </Button>
        </Link>
        <h1 className="text-center text-3xl font-bold tracking-tighter">{group.commonNames.en}</h1>
      </div>
      {process.env.NODE_ENV === "development" && <EditGroupTrigger group={group} />}

      {/* List of high groups */}
      {!showSpecies && group.level === 0 && (
        <div className="grid grid-cols-2 gap-2">
          {group.children.map((child) => (
            <HighLevelGroupCard key={child.id} group={child as any} />
          ))}
        </div>
      )}

      {/* List of sub-groups */}
      {!showSpecies && group.level === 1 && (
        <div className="flex flex-col gap-2">
          {group.children.map((child) => (
            <LowLevelGroupCard key={child.id} group={child as any} />
          ))}
        </div>
      )}

      {/* List of species */}
      {showSpecies && (
        <div className="grid grid-cols-2 gap-2">
          {species.map((species) => (
            <SpeciesCard key={species.id} species={species} />
          ))}
        </div>
      )}
    </div>
  )
}
