import { signOut } from "@/utils/supabase/actions"
import { createClient } from "@/utils/supabase/server"

import { Button } from "@/components/ui/button"
import LoginForm from "@/components/auth/login-form"

export default async function Login() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <>
      {user ? (
        <div className="flex flex-col">
          <div>Hello {user.email}</div>
          <div>
            <form action={signOut}>
              <Button type="submit" className="w-full">
                Logout
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <LoginForm className="my-6 flex justify-center" />
      )}
    </>
  )
}
