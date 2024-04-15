import { Taxa } from "@prisma/client"

import { Card, CardContent } from "@/components/ui/card"

export default function SpeciesCard({ species }: { species: Taxa }) {
  return (
    <Card>
      <CardContent className="relative p-0">
        <div className="relative aspect-[3/2] w-full">
          {/* <ImageLoader src={species.photos[0]} alt={child.title.fr} fill className="rounded-xl object-cover" /> */}
        </div>
        <div className="grid p-2">
          <div className="overflow-auto">
            <div className="truncate font-semibold">{species.commonNames.fr?.[0]}</div>
            <div className="truncate font-semibold">{species.commonNames.en?.[0]}</div>
          </div>
          <div className="truncate text-sm italic text-gray-500">Tursiops truncatus</div>
        </div>
      </CardContent>
    </Card>
  )
}
