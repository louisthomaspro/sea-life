import Link from "next/link"

import prisma from "@/lib/prisma"
import { signOut } from "@/lib/supabase/actions"
import { supabaseServerAuth } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons/icons"
import { Separator } from "@/components/ui/separator"
import LoginForm from "@/components/auth/login-form"

export default async function Account() {
  const { data: user } = await supabaseServerAuth().getSafeSession()

  if (!user) {
    return <LoginForm className="my-6 flex justify-center" />
  }

  const listCount = await prisma.list.count({
    where: {
      ownerId: user?.id,
    },
  })

  return (
    <div className="container py-10">
      {/* Header */}
      <div className={cn("mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2")}>
        <h1 className="text-center text-3xl font-bold tracking-tighter">Account</h1>
      </div>
      <Separator className="mb-2" />
      <div className="grid">
        <Link href="/lists" className="flex items-center gap-4 rounded-md px-5 py-4 hover:bg-gray-100">
          <Icons.list className="size-5" />
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Lists</p>
          </div>
          <div className="ml-auto font-medium">{listCount}</div>
        </Link>
      </div>

      <form action={signOut} className="mt-6">
        <Button type="submit" size={"lg"} className="mx-auto flex">
          Logout
        </Button>
      </form>
    </div>
  )
}
