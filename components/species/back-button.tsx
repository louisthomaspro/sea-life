"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons/icons"

export default function BackButton() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute left-4 top-4 z-10"
      onClick={() => {
        if (window.history.length > 1) router.back()
        else router.push("/")
      }}
    >
      <Icons.chevronLeft className="size-5" />
    </Button>
  )
}
