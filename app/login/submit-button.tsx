"use client"

import { useFormStatus } from "react-dom"

import { Button, ButtonProps } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

export function SubmitButton({ children, ...props }: ButtonProps) {
  const { pending, action } = useFormStatus()

  const isPending = pending && action === props.formAction

  return (
    <Button {...props} type="submit" aria-disabled={pending}>
      {isPending ? <Icons.spinner /> : children}
    </Button>
  )
}
