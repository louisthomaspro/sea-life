import "server-cli-only"

import { unstable_cache } from "next/cache"
import { Prisma } from "@prisma/client"
import { motion, Variants } from "framer-motion"

import prisma from "@/lib/prisma"
import {
  DashboardCarousel,
  DashboardCarouselContent,
  DashboardCarouselItem,
  DashboardCarouselItemTitle,
  DashboardCarouselNext,
  DashboardCarouselPrevious,
} from "@/components/ui/dashboard-carousel"
import ImageLoader from "@/components/ui/image-loader"

interface Species {
  id: number
  commonNames: any
  scientificName: string
  url: string
  blurhashDataUrl: string
}

const getPicks = unstable_cache(
  async () => {
    const query = Prisma.sql`
    SELECT "Taxa"."commonNames", "Taxa"."scientificName", media."url", media."blurhashDataUrl"
    FROM "Taxa"
    LEFT JOIN (
        SELECT "taxaId", "url", "blurhashDataUrl"
        FROM "TaxaMedia"
        ORDER BY "position" ASC
    ) AS media ON media."taxaId" = "Taxa"."id"
    WHERE "Taxa"."rank" = 'species'
    GROUP BY "Taxa"."id", media."url", media."blurhashDataUrl"
    ORDER BY RANDOM()
    LIMIT 5;
  `

    const picks = await prisma.$queryRaw<Species[]>(query)
    return picks
  },
  ["todays-picks"],
  { revalidate: 60 * 60 * 24 } // 24 hours
)

export default async function TodaysPicks() {
  const picks = await getPicks()

  return (
    <DashboardCarousel
      className="relative w-full"
      opts={{
        loop: true,
      }}
    >
      <DashboardCarouselContent className="-ml-1">
        {picks.map((species, index) => (
          <DashboardCarouselItem key={index} className="aspect-video basis-2/3">
            <div className="relative size-full overflow-hidden rounded-lg">
              <ImageLoader
                fill
                src={species.url}
                sizes="100vw"
                blurhashDataURL={species.blurhashDataUrl}
                alt={species.scientificName!}
                className="size-full object-cover"
              />
              <DashboardCarouselItemTitle title={species.scientificName} i={index} />
            </div>
          </DashboardCarouselItem>
        ))}
      </DashboardCarouselContent>
      <DashboardCarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      <DashboardCarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
    </DashboardCarousel>
  )
}
