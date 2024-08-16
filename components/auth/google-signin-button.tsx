"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

import { signInWithProvider } from "@/lib/supabase/actions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons/icons"

interface GoogleSignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const GoogleSignInButton = ({ className, ...props }: GoogleSignInButtonProps) => {
  const searchparams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Button
      {...props}
      variant="outline"
      size={"lg"}
      className={cn("flex gap-2", className)}
      disabled={isLoading}
      onClick={async () => {
        setIsLoading(true)
        try {
          signInWithProvider({ provider: "google", next: searchparams.get("next") })
        } catch (error) {
          setIsLoading(false)
        }
      }}
    >
      {isLoading ? <Icons.spinner className="size-4 animate-spin" /> : <Icons.google className="size-4" />}
      Continue with Google
    </Button>
  )
}
