import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons/icons"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container max-w-screen-md py-6">
      {/* Header */}
      <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <Button variant="outline" size="icon" disabled>
          <Icons.chevronLeft className="size-5" />
        </Button>
        <Skeleton className="h-9 w-48" />
      </div>

      {/* Skeleton for either high-level groups, low-level groups, or species */}
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full" />
        ))}
      </div>
    </div>
  )
}
