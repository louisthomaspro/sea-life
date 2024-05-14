"use client"

import { usePathname } from "next/navigation"

import { signInWithProvider } from "@/lib/supabase/actions"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons/icons"

interface GoogleSignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const GoogleSignInButton = (props: GoogleSignInButtonProps) => {
  const pathname = usePathname()

  return (
    <Button
      {...props}
      variant="outline"
      size={"lg"}
      onClick={() => signInWithProvider({ provider: "google", from: pathname })}
    >
      <span className="mr-2 w-4">
        <Icons.google />
      </span>
      Continue with Google
    </Button>
  )
}
