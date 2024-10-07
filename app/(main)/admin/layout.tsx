import { redirect } from "next/navigation"

import prisma from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export default async function Layout({ children }: { children: React.ReactNode }) {
  // const supabase = await createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) redirect("/")

  // const profile = await prisma.profile.findFirst({
  //   where: {
  //     id: user?.id,
  //   },
  // })

  // if (!profile) redirect("/")

  // if (profile.role !== "admin") redirect("/")

  return <>{children}</>
}
