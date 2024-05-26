import { Suspense } from "react"
import Link from "next/link"
import FaunaPlaceholder from "@/public/videos/fauna-loop-placeholder.png"
import FloraPlaceholder from "@/public/videos/flora-loop-placeholder.png"

import ImageLoader from "@/components/ui/image-loader"
import { SearchInput } from "@/components/search-input"
import TodaysPicks from "@/components/todays-picks"
import VideoLoader from "@/components/video-loader"

export default function HomePage() {
  // const groups = await prisma.group.findMany({
  //   include: {
  //     highLevelTaxa: true,
  //   },
  //   where: {
  //     slug: {
  //       in: ["fauna", "flora"],
  //     },
  //   },
  // })

  // const fauna = groups.find((group) => group.slug === "fauna")
  // const flora = groups.find((group) => group.slug === "flora")

  // if (!fauna || !flora) {
  //   throw new Error("Groups not found")
  // }

  // const faunaSpecies = await getSpeciesByAncestorList(fauna.highLevelTaxa.map((taxa) => taxa.id))
  // const floraSpecies = await getSpeciesByAncestorList(flora.highLevelTaxa.map((taxa) => taxa.id))

  return (
    <div className="pt-10">
      <div className="container">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Explore Marine Life</h1>
          <p className="text-gray-500 dark:text-gray-400">Discover the wonders of the ocean.</p>
        </div>
        <div className="pt-4">
          <SearchInput />
        </div>
        <div className="flex gap-2 pt-6">
          <Link
            href="/explore/fauna"
            className="relative flex-1 rounded-[30px] bg-[#1F3192] transition-transform hover:scale-[99%] active:scale-[98%]"
          >
            {/* Square */}
            <div className="relative aspect-square rounded-[30px] shadow-md">
              <ImageLoader
                src={FaunaPlaceholder.blurDataURL}
                alt="Fauna"
                fill
                className="absolute top-0 size-full rounded-[30px] object-cover"
              />
              <VideoLoader
                autoPlay
                playsInline
                loop
                preload="auto"
                className="absolute top-0 size-full rounded-[30px] duration-500"
                muted
              >
                <source src="/videos/test1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </VideoLoader>
              <div className="absolute top-0 size-full rounded-[30px] shadow-[0_0_70px_rgba(0,0,0,0.9)_inset]" />
              {/* Title */}
              <div className="absolute bottom-4 left-5 space-y-0.5">
                <div className="text-xl font-medium text-background">Fauna</div>
                <div className="text-xs text-muted">1025 species</div>
              </div>
            </div>
            <div className="h-2" />
          </Link>
          <Link
            href="/explore/flora"
            className="relative flex-1 rounded-[30px] bg-[#095413] transition-transform hover:scale-[99%] active:scale-[98%]"
          >
            {/* Square */}
            <div className="relative aspect-square rounded-[30px] shadow-md">
              <ImageLoader
                src={FloraPlaceholder.blurDataURL}
                alt="Flora"
                fill
                className="absolute top-0 size-full rounded-[30px] object-cover"
              />
              <VideoLoader
                width="100%"
                height="100%"
                autoPlay
                playsInline
                loop
                className="absolute top-0 size-full rounded-[30px] duration-500"
                muted
              >
                <source src="/videos/flora-loop.mp4" type="video/mp4" />
                <source src="/videos/test2.webm" type="video/webm" />
                Your browser does not support the video tag.
              </VideoLoader>
              <div className="absolute top-0 size-full rounded-[30px] shadow-[0_0_70px_rgba(0,0,0,0.9)_inset]" />
              {/* Title */}
              <div className="absolute bottom-4 left-5 space-y-0.5">
                <div className="text-xl font-medium text-background">Flora</div>
                <div className="text-xs text-muted">64 species</div>
              </div>
            </div>
            <div className="h-2" />
          </Link>
        </div>
      </div>
      {/* Today's Picks */}
      <div className="mt-5">
        <div className={"container mb-2 flex items-center gap-4"}>
          <div className="text-lg font-semibold">Today's picks</div>
        </div>
        <Suspense>
          <TodaysPicks />
        </Suspense>
      </div>
    </div>
  )
}
