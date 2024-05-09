"use client"

import { useParams, useSearchParams } from "next/navigation"

import { signInWithProvider } from "@/lib/supabase/actions"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

interface GoogleSignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const GoogleSignInButton = (props: GoogleSignInButtonProps) => {
  const searchParams = useSearchParams()

  return (
    <Button
      {...props}
      variant="outline"
      onClick={() => signInWithProvider({ provider: "google", from: searchParams.get("from") ?? "/" })}
    >
      <span className="mr-2 w-4">
        <Icons.google />
      </span>
      Continue with Google
    </Button>
  )
}
