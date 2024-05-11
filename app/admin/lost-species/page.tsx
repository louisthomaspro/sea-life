import { CreateGroupTrigger } from "@/features/admin/create-update-group"

import prisma from "@/lib/prisma"
import { pushModal } from "@/lib/pushmodal/pushmodal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons/icons"

export default async function LostSpeciesPage() {
  const groups = await prisma.group.findMany({
    include: {
      highLevelTaxa: true,
    },
    where: {
      children: {
        none: {},
      },
    },
  })

  const highLevelTaxa = groups.map((group) => group.highLevelTaxa.map((taxon) => taxon.id)).flat()

  const speciesInGroups = await prisma.taxa.findMany({
    where: {
      rank: {
        equals: "species",
      },
      ancestors: {
        some: {
          id: {
            in: highLevelTaxa,
          },
        },
      },
    },
  })

  const allSpecies = await prisma.taxa.findMany({
    where: {
      rank: {
        equals: "species",
      },
    },
  })

  const lostSpecies = allSpecies.filter((species) => !speciesInGroups.some((s) => s.id === species.id))

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">
        Lost Species <Badge>{lostSpecies.length}</Badge>
      </h1>
      <div className="mb-4 flex gap-4">
        <CreateGroupTrigger />
      </div>
      <ul>
        {lostSpecies.map((species, i) => (
          <li key={i}>{species.id}</li>
        ))}
      </ul>
    </div>
  )
}
