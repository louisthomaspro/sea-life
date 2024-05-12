"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons/icons"

export default function ShareButton() {
  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute right-16 top-4 z-10"
      onClick={() => {
        navigator.share({
          title: "Check out this species",
          text: "Learn more about this species",
          url: window.location.href,
        })
      }}
    >
      <Icons.share className="size-5" />
    </Button>
  )
}
