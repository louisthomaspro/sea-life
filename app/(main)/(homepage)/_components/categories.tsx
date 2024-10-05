import Link from "next/link"
import FaunaPlaceholder from "@/public/videos/fauna-loop-placeholder.png"
import FloraPlaceholder from "@/public/videos/flora-loop-placeholder.png"

import ImageLoader from "@/components/ui/image-loader"
import VideoLoader from "@/components/video-loader"

const categories = [
  { name: "Mammals", species: 812, image: "/placeholder.svg?height=400&width=300", color: "bg-orange-400" },
  { name: "Birds", species: 451, image: "/placeholder.svg?height=400&width=300", color: "bg-blue-600" },
  { name: "Reptiles", species: 320, image: "/placeholder.svg?height=400&width=300", color: "bg-green-500" },
  { name: "Fish", species: 1100, image: "/placeholder.svg?height=400&width=300", color: "bg-cyan-500" },
  { name: "Amphibians", species: 215, image: "/placeholder.svg?height=400&width=300", color: "bg-purple-500" },
]

export default function Categories() {
  return (
    <div className="flex w-full max-w-md gap-3">
      <Link
        href="/explore/fauna"
        className="relative flex-1 rounded-[30px] bg-[#1F3192] transition-transform hover:scale-[99%] active:scale-[98%]"
      >
        {/* Square */}
        <div className="relative aspect-square rounded-[30px] shadow-md">
          <ImageLoader
            src={FaunaPlaceholder}
            blurhashDataURL={FaunaPlaceholder.blurDataURL}
            alt="Fauna"
            fill
            className="absolute top-0 size-full rounded-[30px] object-cover"
          />
          <VideoLoader autoPlay playsInline loop className="absolute top-0 size-full rounded-[30px] duration-500" muted>
            <source src="/videos/fauna-loop.mp4" type="video/mp4" />
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
            src={FloraPlaceholder}
            blurhashDataURL={FloraPlaceholder.blurDataURL}
            alt="Flora"
            fill
            className="absolute top-0 size-full rounded-[30px] object-cover"
          />
          <VideoLoader autoPlay playsInline loop className="absolute top-0 size-full rounded-[30px] duration-500" muted>
            <source src="/videos/flora-loop.mp4" type="video/mp4" />
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
  )
}
