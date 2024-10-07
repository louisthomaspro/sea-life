import { Suspense } from "react"

import RegisterForm from "@/app/(auth)/_component/register-form"

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
