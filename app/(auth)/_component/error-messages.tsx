"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function ErrorMessages() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const error = searchParams.get("error")
    if (!error) return
    setTimeout(() => {
      toast.error(error)
    })
  }, [searchParams])

  useEffect(() => {
    const message = searchParams.get("message")
    if (!message) return
    setTimeout(() => {
      toast.success(message)
    })
  }, [searchParams])

  return null
}
