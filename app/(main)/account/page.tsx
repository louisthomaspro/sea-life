import Link from "next/link"
import { redirect } from "next/navigation"

import { signOut } from "@/lib/supabase/actions"
import { getSafeUser } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons/icons"
import { Separator } from "@/components/ui/separator"
import { ListCountSuspense } from "@/app/(main)/account/_components/list-count"

export default async function Account() {
  const user = await getSafeUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container py-10">
      {/* Header */}
      <h1 className="mb-6 px-5 text-3xl font-bold tracking-tighter">Account</h1>
      <Separator className="mb-4" />
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/lists" className="flex h-14 items-center gap-4 rounded-md border px-5 hover:bg-gray-100 sm:h-20">
          <Icons.list className="size-5" />
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Lists</p>
          </div>
          <div className="ml-auto font-medium">
            <ListCountSuspense ownerId={user.id} />
          </div>
        </Link>
        <Link href="/contact" className="flex h-14 items-center gap-4 rounded-md border px-5 hover:bg-gray-100 sm:h-20">
          <Icons.at className="size-5" />
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">Contact</p>
          </div>
        </Link>
        {process.env.NODE_ENV === "development" && (
          <Link
            href="/admin/lost-species"
            className="flex h-14 items-center gap-4 rounded-md border px-5 hover:bg-gray-100 sm:h-20"
          >
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
