import { Suspense } from "react"

import { SearchInput } from "@/components/search-input"
import TodaysPicks from "@/components/todays-picks"
import Categories from "@/app/(main)/(homepage)/_components/categories"

export default function HomePage() {
  return (
    <div className="container pb-10 pt-6">
      <div className="mb-8 flex flex-col items-center justify-between gap-8 lg:mb-10 lg:flex-row lg:gap-14">
        <div className="w-full sm:w-1/2">
          <div className="pt-0 text-center lg:pt-10 lg:text-left">
            <h1 className="mb-2 text-2xl sm:text-3xl md:text-4xl">Discover</h1>
            <h2 className="text-3xl font-bold sm:text-4xl md:text-5xl">Marine Life</h2>
          </div>
          <div className="relative mt-10 flex justify-center">
            <SearchInput />
          </div>
        </div>
        {/* Categories */}
        <div className="flex w-full justify-center self-end sm:mt-0">
          <Categories />
        </div>
      </div>

      {/* Today's Picks */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Today's picks</h2>
        </div>
        <Suspense>
          <TodaysPicks />
        </Suspense>
      </div>
    </div>
  )
}
