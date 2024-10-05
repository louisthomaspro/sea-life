"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function ErrorMessages() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get("message")
    if (!error) return
    setTimeout(() => {
      toast.error(error)
    })
  }, [searchParams])

  return null
}
