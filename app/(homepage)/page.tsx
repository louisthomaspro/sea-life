import { Suspense } from "react"

import { SearchInput } from "@/components/search-input"
import TodaysPicks from "@/components/todays-picks"
import Categories from "@/app/(homepage)/_components/categories"

export default function HomePage() {
  return (
    <div className="container py-6">
      <div>
        <div>
          <h1 className="mb-2 text-3xl">Discover</h1>
          <h2 className="text-4xl font-bold">Marine Life</h2>
        </div>
        <div className="relative mt-8">
          <SearchInput />
        </div>
      </div>

      {/* Categories */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Category</h2>
        </div>
        <Categories />
      </div>

      {/* Today's Picks */}
      <div className="mt-5">
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
