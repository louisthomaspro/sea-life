import Link from "next/link"

import prisma from "@/lib/prisma"
import { signOut } from "@/lib/supabase/actions"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons/icons"
import { Separator } from "@/components/ui/separator"
import LoginForm from "@/components/auth/login-form"

export default async function Account() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <LoginForm className="container flex justify-center" />
      </div>
    )
  }

  const listCount = await prisma.list.count({
    where: {
      ownerId: user?.id,
    },
  })

  return (
    <div className="container py-10">
      {/* Header */}
      <h1 className="mb-6 px-5 text-3xl font-bold tracking-tighter">Account</h1>
      <Separator className="mb-2" />
      <div className="grid">
        <Link href="/lists" className="flex items-center gap-4 rounded-md px-5 py-4 hover:bg-gray-100">
          <Icons.list className="size-5" />
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Lists</p>
          </div>
          <div className="ml-auto font-medium">{listCount}</div>
        </Link>
        {process.env.NODE_ENV === "development" && (
          <Link href="/admin/lost-species" className="flex items-center gap-4 rounded-md px-5 py-4 hover:bg-gray-100">
            <Icons.warning className="size-5" />
            <div className="grid gap-1">
              <p className="text-sm font-medium leading-none">Lost species</p>
            </div>
            <div className="ml-auto font-medium">0</div>
          </Link>
        )}
      </div>

      <form action={signOut} className="mt-6">
        <Button type="submit" size={"lg"} className="mx-auto flex">
          Logout
        </Button>
      </form>
    </div>
  )
}
