import Image from "next/image"
import Link from "next/link"
import Fauna from "@/public/img/fauna.jpg"
import Flora from "@/public/img/flora.jpg"

import { SearchInput } from "@/components/search-input"

export default function HomePage() {
  return (
    <div className="container pt-10">
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
          className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 transition-transform hover:scale-[99%] active:scale-[98%]"
        >
          <Image src={Fauna} alt="Fauna" width={300} height={200} />
          <div className="absolute bottom-2 left-4 text-lg font-semibold text-background">Fauna</div>
        </Link>
        <Link
          href="/explore/flora"
          className="relative aspect-square overflow-hidden rounded-lg border border-gray-200 transition-transform hover:scale-[99%] active:scale-[98%]"
        >
          <Image src={Flora} alt="Flora" width={300} height={300} />
          <div className="absolute bottom-2 left-4 text-lg font-semibold text-background">Flora</div>
        </Link>
      </div>
    </div>
  )
}
