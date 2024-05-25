import "server-cli-only"

import { unstable_cache } from "next/cache"
import Link from "next/link"
import { Prisma } from "@prisma/client"

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
    SELECT "Taxa".id, "Taxa"."commonNames", "Taxa"."scientificName", media."url", media."blurhashDataUrl"
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
      <div className="container relative overflow-hidden">
        <DashboardCarouselContent className="">
          {picks.map((species, index) => (
            <DashboardCarouselItem key={index} className="aspect-video">
              <Link href={`/species/${species.id}`}>
                <div className="relative size-full overflow-hidden rounded-[30px] border border-gray-200 transition-transform hover:scale-[99%] active:scale-[98%]">
                  <ImageLoader
                    fill
                    src={species.url}
                    sizes="100vw"
                    blurhashDataURL={species.blurhashDataUrl}
                    alt={species.scientificName!}
                    priority={index === 1}
                    className="size-full object-cover"
                  />
                  <DashboardCarouselItemTitle title={species.commonNames.en?.[0] ?? species.scientificName} i={index} />
                </div>
              </Link>
            </DashboardCarouselItem>
          ))}
        </DashboardCarouselContent>
      </div>
      <DashboardCarouselNext className="absolute right-8 top-1/2 -translate-y-1/2" />
      <DashboardCarouselPrevious className="absolute left-8 top-1/2 -translate-y-1/2" />
    </DashboardCarousel>
  )
}
