"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

export default function RegisterButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating Account..." : "Create Account"}
    </Button>
  )
}
