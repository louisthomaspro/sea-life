import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export default async function ProtectedPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return <div>This is protected</div>
}
