import Link from "next/link"

import { getSafeUser } from "@/lib/supabase/server"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default async function UserAccount() {
  const user = await getSafeUser()

  if (!user) {
    return (
      <div className="flex gap-2">
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link href="/register">
          <Button>Register</Button>
        </Link>
      </div>
    )
  }

  return (
    <Link href="/account">
      <Avatar className="cursor-pointer">
        <AvatarFallback>{user.email![0].toUpperCase()}</AvatarFallback>
      </Avatar>
    </Link>
  )
}
