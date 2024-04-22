import Link from "next/link"
import { Prisma } from "@prisma/client"

import { Card, CardContent } from "@/components/ui/card"
import ImageLoader from "@/components/ui/image-loader"

type groupWithHighlightedSpecies = Prisma.GroupGetPayload<{
  include: {
    highlightedSpecies: {
      include: {
        medias: true
      }
    }
  }
}>

export default function HighLevelGroupCard({ group }: { group: groupWithHighlightedSpecies }) {
  return (
    <Link key={group.id} href={`/explore/${group.slug}`}>
      <Card>
        <CardContent className="relative p-0">
          <div className="grid grid-cols-2 gap-0.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="relative aspect-[3/2] overflow-hidden rounded-sm">
                {group.highlightedSpecies[index] ? (
                  <ImageLoader
                    src={group.highlightedSpecies[index].medias[0].url}
                    alt={group.highlightedSpecies[index].commonNames.en?.[0]!}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <ImageLoader src="/placeholder.jpg" alt="placeholder" fill className="object-cover" />
                )}
              </div>
            ))}
          </div>
          <div className="grid p-2">
            <div className="overflow-auto">
              <div className="truncate font-semibold">{group.commonNames.en}</div>
            </div>
            <div className="truncate text-sm text-gray-500">{group.subtitle.en}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
