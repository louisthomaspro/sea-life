"use client"

import { useFormStatus } from "react-dom"

import { Button } from "@/components/ui/button"

export default function LoginButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Logging in..." : "Login with Email"}
    </Button>
  )
}
